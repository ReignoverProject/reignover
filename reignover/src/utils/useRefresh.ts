import { useContext } from 'react'
import { RefreshContext } from './context/refreshContext'


const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh