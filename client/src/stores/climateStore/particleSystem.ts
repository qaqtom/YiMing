import {
  Cartesian3,
  Matrix4,
  ParticleSystem,
  Particle,
  Cartesian2,
  Math as CesiumMath,
  SphereEmitter,
  Color,
} from 'cesium'

import type { particleOptionType } from './type.ts'

export default function renderParticle({
  viewer,
  url = '/雪花.png',
  speed = [10, 50],
  position = Cartesian3.fromDegrees(120.17118065585795, 35.94180290187531, 2000),
  fly = false,
  snowRadius = 3000.0,
  emissionRate = 100.0,
  minimumSnowImageSize = new Cartesian2(10, 10),
  maximumSnowImageSize = new Cartesian2(20, 20),
}: particleOptionType) {
  function snowUpdate(particle: Particle) {
    //计算提供的笛卡尔坐标系的标准化形式
    /**
     * @param 参数1 ----要标准化的笛卡尔坐标
     * @param 参数2 ----结果存储对象
     */
    Cartesian3.normalize(particle.position, snowGravityScratch)
    Cartesian3.multiplyByScalar(
      snowGravityScratch, //要缩放的笛卡尔坐标
      CesiumMath.randomBetween(-speed[0], -speed[1]), //要与之相乘的标量，负值代表例子位置下降，即例子从上往下落
      snowGravityScratch
    )
    Cartesian3.add(particle.position, snowGravityScratch, particle.position)
  }

  const modelMatrix: Matrix4 = Matrix4.fromTranslation(position)
  //创建Cartesian3对象，用于在粒子系统回调函数中动态更新例子的位置
  const snowGravityScratch = new Cartesian3()
  type ParticleSystemType = ConstructorParameters<typeof ParticleSystem>[0]
  const snowOption: ParticleSystemType = {
    modelMatrix: modelMatrix,
    lifetime: 15.0,
    emitter: new SphereEmitter(snowRadius),
    startScale: 0.5,
    endScale: 1.0,
    image: url,
    emissionRate: emissionRate,
    startColor: Color.WHITE.withAlpha(1.0),
    endColor: Color.WHITE.withAlpha(0.5),
    minimumImageSize: minimumSnowImageSize,
    maximumImageSize: maximumSnowImageSize,
    updateCallback: snowUpdate,
  }
  const particle = new ParticleSystem(snowOption)
  viewer.scene.primitives.add(particle)
  if (fly) {
    viewer.camera.flyTo({
      destination: position,
    })
  }

  return particle
}
