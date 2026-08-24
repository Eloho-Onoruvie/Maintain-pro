import { apiClient } from './client'

export interface UploadedFile { id: string; secureUrl: string; url: string; originalName: string }

export async function uploadImage(file: File): Promise<UploadedFile> {
  const body = new FormData()
  body.append('file', file)
  return apiClient.post<UploadedFile>('/uploads', body, { headers: { 'Content-Type': 'multipart/form-data' } })
}
