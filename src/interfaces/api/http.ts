import { AxiosRequestConfig, default as axios } from 'axios'
import { Primitive } from 'utility-types'

const DOMAIN = process.env.DOMAIN ?? 'https://tasks-api-express.herokuapp.com'

const paramsSerializer = (params: Record<string, Primitive | Primitive[]>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    // array format: repeat
    if (Array.isArray(value)) {
      value.forEach((value_) => {
        searchParams.append(key, String(value_))
      })
      return
    }

    searchParams.append(key, String(value))
  })

  return searchParams.toString()
}

export const defaultAxiosRequestConfig: Readonly<AxiosRequestConfig> = {
  baseURL: `${DOMAIN}/api/v1`,
  withCredentials: false,
  timeout: 30_000,
  paramsSerializer,
}

export const http = axios.create(defaultAxiosRequestConfig)
