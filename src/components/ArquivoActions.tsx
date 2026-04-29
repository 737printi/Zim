'use client'

import { useState } from 'react'
import { Edit2, Trash2, Loader2, AlertOctagon } from 'lucide-react'
import { deleteStlFile } from '@/app/(dashboard)/admin/arquivos/actions'
import Link from 'next/link'

interface ArquivoActionsProps {
  fileId: string
  fileUrl: string
  galleryUrls: string[]
}

export default function ArquivoActions({ fileId, fileUrl, galleryUrls }: ArquivoActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      await deleteStlFile(fileId, fileUrl, galleryUrls || [])
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      alert("Ocorreu um erro ao deletar o arquivo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Link 
          href={`/admin/arquivos/editar/${fileId}`}
          className="p-2 text-zinc-400 hover:text-[var(--color-zim-cyan)] hover:bg-[var(--color-zim-cyan)]/10 rounded-lg transition-colors"
          title="Editar Arquivo"
        >
          <Edit2 className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Deletar Arquivo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isLoading && setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[var(--color-zim-card)] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 md:p-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Excluir Modelo 3D
              </h2>
              <div className="text-zinc-300 text-sm text-center mb-8">
                Isso apagará permanentemente o arquivo STL e as imagens da galeria. O modelo não estará mais disponível para download por nenhum aluno. Esta ação não pode ser desfeita.
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sim, Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
