'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Box, Loader2, Save, File, Image as ImageIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveFileMetadata } from './actions'

export default function NovoArquivoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [stlFile, setStlFile] = useState<File | null>(null)

  const supabase = createClient()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 5)) // Max 5 images
    }
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stlFile) {
      setError("Você precisa selecionar um arquivo .STL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let thumbnailUrl = null
      let galleryUrls: string[] = []
      
      // 1. Upload Images
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          
          const { error: thumbError } = await supabase.storage
            .from('thumbnails')
            .upload(fileName, file)

          if (thumbError) throw new Error('Erro no upload da imagem: ' + thumbError.message)
          
          const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(fileName)
          
          galleryUrls.push(publicUrl)
          
          if (i === 0) {
            thumbnailUrl = publicUrl // First image is the thumbnail
          }
        }
      }

      // 2. Upload STL File
      const stlExt = stlFile.name.split('.').pop()
      const stlName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${stlExt}`
      
      const { error: stlError } = await supabase.storage
        .from('stl-files')
        .upload(stlName, stlFile)

      if (stlError) throw new Error('Erro no upload do STL: ' + stlError.message)

      // 3. Save Metadata
      await saveFileMetadata({
        title,
        description,
        category,
        thumbnailUrl,
        galleryUrls,
        fileUrl: stlName // We only save the path for private buckets
      })

      router.push('/admin/arquivos')
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o arquivo.')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/arquivos" className="inline-flex items-center text-sm text-[var(--color-zim-muted)] hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a lista
      </Link>

      <div className="bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[var(--color-zim-border)]">
          <h1 className="text-2xl font-display font-bold text-white mb-2">Cadastrar Novo Arquivo STL</h1>
          <p className="text-[var(--color-zim-muted)] text-sm">Preencha as informações do modelo 3D e faça o upload do arquivo e da galeria de imagens.</p>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Título do Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-zim-border)] rounded-xl bg-zinc-950/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] transition-all"
                  placeholder="Ex: Suporte para Headset"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-zim-border)] rounded-xl bg-zinc-950/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] transition-all"
                  placeholder="Ex: Setup Gamer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Descrição
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-zim-border)] rounded-xl bg-zinc-950/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] transition-all resize-none"
                  placeholder="Detalhes sobre a impressão, dicas de fatiamento..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Upload da Galeria */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Galeria de Imagens (Até 5 fotos)
                </label>
                
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg border border-[var(--color-zim-border)] overflow-hidden bg-zinc-900 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/60 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-center py-0.5 font-bold text-[var(--color-zim-cyan)]">
                            CAPA
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {imageFiles.length < 5 && (
                  <label className="border-2 border-dashed border-[var(--color-zim-border)] rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-950/30 hover:bg-zinc-900/50 transition-colors cursor-pointer group relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-zinc-400 group-hover:text-[var(--color-zim-cyan)] transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Clique para enviar imagens</p>
                    <p className="text-xs text-zinc-500 text-center">A primeira imagem será usada como capa</p>
                  </label>
                )}
              </div>

              {/* Upload do Arquivo STL */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-zim-orange)] mb-2">
                  Arquivo STL *
                </label>
                <label className="border-2 border-dashed border-[var(--color-zim-orange)]/50 rounded-xl p-8 flex flex-col items-center justify-center bg-[var(--color-zim-orange)]/5 hover:bg-[var(--color-zim-orange)]/10 transition-colors cursor-pointer group">
                  <input 
                    type="file" 
                    accept=".stl" 
                    className="hidden" 
                    onChange={e => setStlFile(e.target.files?.[0] || null)}
                  />
                  {stlFile ? (
                    <div className="text-center">
                      <File className="w-10 h-10 text-[var(--color-zim-orange)] mx-auto mb-3" />
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{stlFile.name}</p>
                      <p className="text-xs text-[var(--color-zim-orange)] mt-1">{(stlFile.size / 1024 / 1024).toFixed(2)} MB - Clique para trocar</p>
                    </div>
                  ) : (
                    <>
                      <Box className="w-10 h-10 text-[var(--color-zim-orange)] mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-white mb-1">Upload do modelo .STL</p>
                      <p className="text-xs text-zinc-400 text-center">Clique para procurar no computador</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-zim-border)] flex flex-col-reverse sm:flex-row justify-end gap-4">
            <Link 
              href="/admin/arquivos"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading || !stlFile}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,95,31,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Fazendo Upload...' : 'Salvar e Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
