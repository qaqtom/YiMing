//#define VERT_SR 12.
#version es 300
#define VERT_SR 6.
uniform float voHeight;
uniform float origin_x;
uniform float origin_y;
uniform float x_length;
uniform float y_length;
vec2 decodeValue(vec4 cv){
    float a=(cv.r+cv.g+cv.b)/3.;
    return vec2(a,cv.w);
}
vec2 getValue(vec3 pos){
    vec2 uv=pos.xy;
    if(uIsMask&&texture(uMaskTex,uv).a<.5)
    return vec2(-1.,0.);
    return decodeValue(texture(uDataTex,(uv)).xyzw);
}

vec4 computeColorVR(float val){
    if(uIsFilter&&(val<uFilterRange.x||val>uFilterRange.y)||val<-.9)
    return vec4(0.,0.,0.,0.);
    int i=0;
    int n=int(uNColorScheme);
    for(int k=0;k<16;k++){
        if(k==n-2||uGradPos[k+1]>val){
            float vmin=uGradPos[k];
            float span=uGradPos[k+1]-vmin;
            vec3 clr=LINEAR_INTERP(uColorScheme[k],uColorScheme[k+1],(val-vmin)/span);
            return vec4(clr,1.);
        }
    }
    return vec4(0.,0.,0.,0.);
}
vec2 lnglat2grid(vec2 lnglat){
    float d=lnglat.x/czm_pi*180.-origin_x;
    float l=origin_y-lnglat.y/czm_pi*180.;
    if(d<0.){
        d=360.+d;
    }
    vec2 xy=vec2(abs(d),l);
    xy/=vec2(x_length,y_length);
    return clamp(xy,0.,1.);
}

#ifdef _VS_
out vec3 vPos;
in vec4 position;
void main(){
    vec2 lnglat=position.xy;
    float height=voHeight;
    height*=uHeightMag;
    vPos=wgs84ToCartesian(vec3(lnglat,height));
    gl_Position=czm_viewProjection*vec4(vPos,1.);
}

#endif

#ifdef _FS_
in vec3 vPos;
out vec4 fragColor;
void main(){
    vec3 cart=cartesianToWgs84(vPos);
    vec3 uvl=vec3(lnglat2grid(cart.xy),cart.z);
    vec2 val=getValue(uvl);
    vec4 nclr,clr=computeColorVR(val.x);
    float threshold=.05;// 调整这个阈值以适应你的需求
    
    // 根据阈值调整 alpha 值
    float alpha=(val.x<threshold)?0.:clr.a;
    
    // 设置 fragColor，确保过黑像素被透明
    fragColor=vec4(clr.rgb,val.y*alpha*.5);
}

#endif