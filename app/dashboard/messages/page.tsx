"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  X,
  Building2,
  Package,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  pack?: string
  budget?: string
  message: string
  status: 'new' | 'replied' | 'archived'
  priority: 'high' | 'medium' | 'low'
  date: string
  created_at: string
  subject: string
  client: string
}

const statusColors = {
  new: "bg-blue-500/20 text-blue-500",
  replied: "bg-green-500/20 text-green-500",
  archived: "bg-gray-500/20 text-gray-500"
}

const statusLabels = {
  new: "Nouveau",
  replied: "Répondu",
  archived: "Archivé"
}

const priorityColors = {
  high: "bg-red-500/20 text-red-500",
  low: "bg-green-500/20 text-green-500"
}

const priorityLabels = {
  high: "Haute",
  low: "Basse"
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dayFilter, setDayFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, dayFilter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des messages')
      }
      
      setMessages(data.data)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors du chargement des messages')
    } finally {
      setLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.company && message.company.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtrer par jours
    if (dayFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch(dayFilter) {
        case '7':
          filterDate.setDate(now.getDate() - 7)
          break
        case '30':
          filterDate.setDate(now.getDate() - 30)
          break
        case '90':
          filterDate.setDate(now.getDate() - 90)
          break
      }

      filtered = filtered.filter(message => {
        const messageDate = new Date(message.created_at)
        return dayFilter === 'all' || messageDate >= filterDate
      })
    }

    setFilteredMessages(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des messages...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchMessages}>Réessayer</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Gérez vos messages clients et demandes de contact.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Le bouton filtre a été supprimé */}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un message..."
            className="pl-9 bg-secondary/50 border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground appearance-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">Tous les messages</option>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message: Message, index: number) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{message.client}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {message.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {message.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[message.priority as keyof typeof priorityColors]}`}>
                  {priorityLabels[message.priority as keyof typeof priorityLabels]}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[message.status as keyof typeof statusColors]}`}>
                  {statusLabels[message.status as keyof typeof statusLabels]}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">{message.subject}</h4>
              <p className="text-muted-foreground">{message.message}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                {message.date}
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                onClick={() => setSelectedMessage(message)}
              >
                Détails
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popup Détails */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Détails du message</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informations client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium">Nom:</span>
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="font-medium">Email:</span>
                      <span>{selectedMessage.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-medium">Téléphone:</span>
                      <span>{selectedMessage.phone}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedMessage.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="font-medium">Entreprise:</span>
                        <span>{selectedMessage.company}</span>
                      </div>
                    )}
                    {selectedMessage.pack && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="font-medium">Pack:</span>
                        <span>{selectedMessage.pack}</span>
                      </div>
                    )}
                    {selectedMessage.budget && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-medium">Budget:</span>
                        <span>{selectedMessage.budget}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-medium mb-2">Message:</h3>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[selectedMessage.priority as keyof typeof priorityColors]}`}>
                      {priorityLabels[selectedMessage.priority as keyof typeof priorityLabels]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[selectedMessage.status as keyof typeof statusColors]}`}>
                      {statusLabels[selectedMessage.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
