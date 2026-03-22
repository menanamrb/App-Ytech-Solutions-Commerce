"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDevis } from "@/hooks/use-devis"


const statusConfig = {
  pending: { 
    label: "En attente", 
    color: "bg-yellow-500/20 text-yellow-500",
    icon: Clock 
  },
  accepted: { 
    label: "Accepte", 
    color: "bg-primary/20 text-primary",
    icon: CheckCircle 
  },
  rejected: { 
    label: "Refusé", 
    color: "bg-destructive/20 text-destructive",
    icon: XCircle 
  },
  completed: { 
    label: "Terminé", 
    color: "bg-green-500/20 text-green-500",
    icon: CheckCircle 
  }
}

export default function DevisPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { devis, loading, error, fetchDevis, updateDevisStatus, deleteDevis } = useDevis()

  useEffect(() => {
    fetchDevis(statusFilter, searchQuery)
  }, [statusFilter, searchQuery])

  const filteredQuotes = devis.filter(quote => {
    const matchesSearch = !searchQuery || 
      quote.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (id: number, newStatus: 'pending' | 'accepted' | 'rejected' | 'completed') => {
    try {
      await updateDevisStatus(id, newStatus)
      setShowDetailModal(false)
      // Forcer le rafraîchissement des données pour mettre à jour l'affichage
      setTimeout(() => {
        fetchDevis(statusFilter, searchQuery)
      }, 100)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const openDetailModal = (quote: any) => {
    setSelectedQuote(quote)
    setShowDetailModal(true)
  }

  // Mettre à jour le filtre de statut
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status)
    // Forcer le rafraîchissement des données avec le nouveau filtre
    setTimeout(() => {
      fetchDevis(status, searchQuery)
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des devis</h1>
          <p className="text-muted-foreground">{devis.length} devis au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, référence ou service..."
            className="pl-9 bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter ? statusConfig[statusFilter as keyof typeof statusConfig].label : "Tous les statuts"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                Tous les statuts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("pending")}>
                En attente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("accepted")}>
                Acceptés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("rejected")}>
                Refusés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("completed")}>
                Terminés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "En attente", count: devis.filter(q => q.status === "pending").length, color: "text-yellow-500" },
          { label: "Acceptés", count: devis.filter(q => q.status === "accepted").length, color: "text-primary" },
          { label: "Refusés", count: devis.filter(q => q.status === "rejected").length, color: "text-destructive" },
          { label: "Terminés", count: devis.filter(q => q.status === "completed").length, color: "text-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Reference</th>
                <th className="text-left p-4 font-medium text-sm">Client</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Service</th>
                <th className="text-left p-4 font-medium text-sm">Montant</th>
                <th className="text-left p-4 font-medium text-sm">Statut</th>
                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Date</th>
                <th className="text-right p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQuotes.map((quote) => {
                const StatusIcon = statusConfig[quote.status as keyof typeof statusConfig].icon
                return (
                  <motion.tr
                    key={quote.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm">{quote.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{quote.client_name}</p>
                        <p className="text-xs text-muted-foreground">{quote.client_email}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm">{quote.service}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">
                        {parseFloat(quote.amount).toLocaleString('fr-FR')} {quote.service.includes("Maintenance") ? "DHS/mois" : "DHS"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[quote.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[quote.status as keyof typeof statusConfig].label}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetailModal(quote)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de 1 a {filteredQuotes.length} sur {filteredQuotes.length} resultats
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quote Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Détails du devis</h2>
                  <p className="text-sm text-muted-foreground">{selectedQuote.reference}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedQuote.status as keyof typeof statusConfig].color}`}>
                  {statusConfig[selectedQuote.status as keyof typeof statusConfig].label}
                </span>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{selectedQuote.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedQuote.client_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedQuote.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Montant</p>
                    <p className="font-medium text-lg">{parseFloat(selectedQuote.amount).toLocaleString('fr-FR')} {selectedQuote.service.includes("Maintenance") ? "DHS/mois" : "DHS"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="font-medium">{new Date(selectedQuote.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date limite</p>
                    <p className="font-medium">{new Date(selectedQuote.deadline).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Description du projet */}
                {selectedQuote.project_description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description du projet</p>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm">{selectedQuote.project_description}</p>
                    </div>
                  </div>
                )}

                {/* Actions de statut */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-4">Changer le statut</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedQuote.status !== 'pending' && (
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleStatusUpdate(selectedQuote.id, 'pending')}
                      >
                        <Clock className="w-4 h-4" />
                        En attente
                      </Button>
                    )}
                    {selectedQuote.status !== 'accepted' && (
                      <Button 
                        className="gap-2 bg-primary text-primary-foreground"
                        onClick={() => handleStatusUpdate(selectedQuote.id, 'accepted')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accepter
                      </Button>
                    )}
                    {selectedQuote.status !== 'rejected' && (
                      <Button 
                        variant="destructive" 
                        className="gap-2"
                        onClick={() => handleStatusUpdate(selectedQuote.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </Button>
                    )}
                    {selectedQuote.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        className="gap-2 border-green-500 text-green-500 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(selectedQuote.id, 'completed')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Terminer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
