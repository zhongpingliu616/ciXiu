import { get, post } from '@/utils/request'
export * from './xn'
export * from './gz'
export const messageLists = () => get('/embroid/message/lists')
export const messageDetails = (data) => get('/embroid/message/details', data)
