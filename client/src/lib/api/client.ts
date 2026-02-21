const API_BASE = '/api';

interface UploadOptions {
  endpoint: string;
  file: File;
  additionalData?: Record<string, string | number>;
  onProgress?: (percent: number) => void;
}

export async function uploadFile<T>(options: UploadOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', options.file);
    
    if (options.additionalData) {
      Object.entries(options.additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.responseType === 'blob') {
          resolve(xhr.response as unknown as T);
        } else {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText as unknown as T);
          }
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', `${API_BASE}${options.endpoint}`);
    xhr.send(formData);
  });
}

export async function downloadProcessedFile(
  endpoint: string, 
  file: File, 
  additionalData?: Record<string, string | number>,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    
    xhr.responseType = 'blob';
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as Blob);
      } else {
        reject(new Error('Processing failed'));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', `${API_BASE}${endpoint}`);
    xhr.send(formData);
  });
}