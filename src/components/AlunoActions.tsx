'use client'

import { useState } from 'react'
import { MoreVertical, Ban, Trash2, Loader2, AlertOctagon } from 'lucide-react'
import { cancelUserSubscription, deleteUser } from '@/app/(dashboard)/admin/alunos/actions'

interface AlunoActionsProps {
  userId: string
  status: string
}

export default function AlunoActions({ userId, status }: AlunoActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'cancel' | 'delete' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleAction() {
    setIsLoading(true)
    try {
      if (modalType === 'cancel') {
        await cancelUserSubscription(userId)
      } else if (modalType === 'delete') {
        await deleteUser(userId)
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      alert("Ocorreu um erro ao executar a ação.")
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  function openModal(type: 'cancel' | 'delete') {
    setModalType(type)
    setIsModalOpen(true)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
            {status !== 'canceled' && (
              <button 
                onClick={() => openModal('cancel')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-yellow-500 hover:bg-yellow-500/10 transition-colors text-left"
              >
                <Ban className="w-4 h-4" />
                Suspender Assinatura
              </button>
            )}
            <button 
              onClick={() => openModal('delete')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Aluno
            </button>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isLoading && setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[var(--color-zim-card)] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 md:p-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                {modalType === 'cancel' ? 'Suspender Assinatura' : 'Excluir Aluno Permanente'}
              </h2>
              <div className="text-zinc-300 text-sm text-center mb-8">
                {modalType === 'cancel' 
                  ? 'Isso revogará o acesso do aluno imediatamente e o status ficará como Cancelado. Tem certeza?'
                  : 'Essa ação deleta a conta, o histórico de downloads e revoga todos os acessos do aluno permanentemente. Esta ação não pode ser desfeita. Deseja continuar?'
                }
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
                  onClick={handleAction}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sim, Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
