/** Ambient types so the industrial viewport typechecks without @types/three (three 0.186 ships no declarations). */
declare module "three" {
  export class Color {
    constructor(hex: string | number);
    setHex(hex: number): void;
  }
  class Vec3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): void;
  }
  export class Object3D {
    rotation: Vec3;
    position: Vec3;
    add(...objects: object[]): this;
    clone(): this;
  }
  export class Group extends Object3D {}
  export class Scene extends Object3D {
    traverse(cb: (obj: Object3D) => void): void;
  }
  export class PerspectiveCamera extends Object3D {
    constructor(fov: number, aspect: number, near: number, far: number);
    aspect: number;
    lookAt(x: number, y: number, z: number): void;
    updateProjectionMatrix(): void;
  }
  export class Material {
    dispose(): void;
    color: Color;
    emissive: Color;
  }
  export class MeshStandardMaterial extends Material {
    constructor(params?: object);
  }
  export class MeshBasicMaterial extends Material {
    constructor(params?: object);
  }
  interface Geometry {
    dispose(): void;
  }
  export class Mesh extends Object3D {
    constructor(geometry?: Geometry, material?: Material);
    geometry?: Geometry;
    material?: Material | Material[];
  }
  export class AmbientLight extends Object3D {
    constructor(color: number, intensity?: number);
  }
  export class DirectionalLight extends Object3D {
    constructor(color: number, intensity?: number);
  }
  export class PointLight extends Object3D {
    constructor(color: Color | number, intensity?: number, distance?: number);
    intensity: number;
  }
  export class WebGLRenderer {
    constructor(params?: object);
    setPixelRatio(n: number): void;
    setSize(w: number, h: number, updateStyle?: boolean): void;
    render(scene: object, camera: object): void;
    dispose(): void;
  }
  export class TorusGeometry implements Geometry {
    constructor(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number);
    dispose(): void;
  }
  export class CylinderGeometry implements Geometry {
    constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number);
    dispose(): void;
  }
  export class ConeGeometry implements Geometry {
    constructor(radius?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean);
    dispose(): void;
  }
  export class BoxGeometry implements Geometry {
    constructor(width?: number, height?: number, depth?: number);
    dispose(): void;
  }
  export class SphereGeometry implements Geometry {
    constructor(radius?: number, widthSegments?: number, heightSegments?: number);
    dispose(): void;
  }
  export class CircleGeometry implements Geometry {
    constructor(radius?: number, segments?: number);
    dispose(): void;
  }
  export const DoubleSide: number;
}
