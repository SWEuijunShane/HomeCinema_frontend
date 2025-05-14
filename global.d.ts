// global.d.ts
import { Object3D, AmbientLight, DirectionalLight } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        object: Object3D
      }
      ambientLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        args?: ConstructorParameters<typeof AmbientLight>
      }
      directionalLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        args?: ConstructorParameters<typeof DirectionalLight>
      }
    }
  }
}
