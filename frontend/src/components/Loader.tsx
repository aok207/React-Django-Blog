import {CSSProperties} from 'react'
import { ClipLoader } from 'react-spinners'

type LoaderType = {
  override: CSSProperties,
  loading: boolean,
  color: string,
  size: number
}

const Loader = ({override, loading, color, size}: LoaderType) => {
  return (
    <ClipLoader
      size={size}
      color={color}
      loading={loading}
      cssOverride={override}
    />
  )
}

export default Loader