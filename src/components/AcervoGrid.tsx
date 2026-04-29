'use client'

import { useState } from 'react'
import { Search, Download, Box, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

import { downloadFile } from '@/app/(dashboard)/membro/actions'

interface STLFile {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url: string | null
  gallery_urls: string[] | null
  file_url: string
  downloads_count: number
  created_at: string
}

export default function AcervoGrid({ files, hideSearch = false, title = "Acervo 3D", subtitle = "Navegue e baixe os modelos exclusivos da plataforma." }: { files: STLFile[], hideSearch?: boolean, title?: string, subtitle?: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<STLFile | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  const filteredFiles = hideSearch ? files : files.filter(file => 
    file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (file.category && file.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleOpenModal = (file: STLFile) => {
    setSelectedFile(file)
    setCurrentImageIndex(0)
  }

  const handleCloseModal = () => {
    setSelectedFile(null)
  }

  const allImages = selectedFile 
    ? (selectedFile.gallery_urls && selectedFile.gallery_urls.length > 0 
        ? selectedFile.gallery_urls 
        : (selectedFile.thumbnail_url ? [selectedFile.thumbnail_url] : []))
    : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">{title}</h1>
          <p className="text-[var(--color-zim-muted)]">{subtitle}</p>
        </div>
        
        {!hideSearch && (
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-[var(--color-zim-border)] rounded-xl bg-zinc-950/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] focus:border-transparent transition-all sm:text-sm"
              placeholder="Buscar modelos..."
            />
          </div>
        )}
      </div>

      {/* Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div 
              key={file.id} 
              onClick={() => handleOpenModal(file)}
              className="group block cursor-pointer"
            >
              <div className="bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-2xl overflow-hidden hover:border-[var(--color-zim-orange)]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,95,31,0.15)] h-full flex flex-col">
                <div className="aspect-square bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                  {file.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={file.thumbnail_url} 
                      alt={file.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Box className="w-16 h-16 text-zinc-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-zim-card)] to-transparent opacity-60" />
                  
                  {file.category && (
                    <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur border border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      {file.category}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-[var(--color-zim-orange)] transition-colors line-clamp-1">{file.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4 flex-1">
                    {file.description || 'Nenhuma descrição fornecida.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-zim-border)]">
                    <span className="text-xs text-zinc-500 font-medium">
                      {file.downloads_count} downloads
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[var(--color-zim-orange)]/10 flex items-center justify-center group-hover:bg-[var(--color-zim-orange)] transition-colors">
                      <Download className="w-4 h-4 text-[var(--color-zim-orange)] group-hover:text-white transition-colors" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)] border-dashed mx-4 md:mx-0">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Nenhum modelo encontrado</h3>
          <p className="text-zinc-500">Tente buscar por outro termo ou limpe a pesquisa.</p>
        </div>
      )}

      {/* Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal} />
          
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Fechar botão Mobile */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black text-zinc-300 hover:text-white rounded-full transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lado Esquerdo: Galeria (Fica no topo no Mobile) */}
            <div className="w-full md:w-3/5 bg-zinc-950 flex flex-col relative h-64 md:h-auto min-h-0">
              {allImages.length > 0 ? (
                <>
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={allImages[currentImageIndex]} 
                      alt="Galeria" 
                      className="w-full h-full object-contain"
                    />
                    
                    {allImages.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
                          {allImages.map((_, i) => (
                            <button 
                              key={i} 
                              onClick={() => setCurrentImageIndex(i)}
                              className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-[var(--color-zim-cyan)] w-4' : 'bg-zinc-500 hover:bg-zinc-300'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-zinc-900 border-b md:border-b-0 md:border-r border-[var(--color-zim-border)]">
                  <Box className="w-20 h-20 text-zinc-800" />
                </div>
              )}
            </div>

            {/* Lado Direito: Detalhes */}
            <div className="w-full md:w-2/5 flex flex-col overflow-y-auto">
              {/* Fechar botão Desktop */}
              <div className="hidden md:flex justify-end p-4 border-b border-[var(--color-zim-border)]">
                <button 
                  onClick={handleCloseModal}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                {selectedFile.category && (
                  <span className="inline-block px-3 py-1 rounded-md bg-zinc-800/50 text-[var(--color-zim-orange)] text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                    {selectedFile.category}
                  </span>
                )}
                
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                  {selectedFile.title}
                </h2>
                
                <div className="prose prose-invert prose-sm text-zinc-400 mb-8 flex-1">
                  <p className="whitespace-pre-wrap">{selectedFile.description || 'Nenhuma descrição fornecida.'}</p>
                </div>

                <div className="pt-6 border-t border-[var(--color-zim-border)]">
                  <form action={downloadFile} onSubmit={() => setIsDownloading(true)}>
                    <input type="hidden" name="fileId" value={selectedFile.id} />
                    <input type="hidden" name="fileUrl" value={selectedFile.file_url} />
                    <button 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,95,31,0.2)] group"
                    >
                      {isDownloading ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 animate-pulse" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                          Baixar Modelo STL
                        </>
                      )}
                    </button>
                  </form>
                  <p className="text-center text-xs text-zinc-500 mt-4">
                    Tamanho do arquivo pode variar. O download será iniciado de forma segura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
