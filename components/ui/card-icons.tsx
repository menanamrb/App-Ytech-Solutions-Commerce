"use client"

interface CardIconProps {
  type: 'visa' | 'mastercard' | 'amex'
  className?: string
}

export function CardIcon({ type, className = "" }: CardIconProps) {
  const baseClasses = "w-10 h-6 flex items-center justify-center rounded"
  
  switch (type) {
    case 'visa':
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-blue-600 to-blue-800 ${className}`}>
          <img 
            src="https://img.icons8.com/color/144/visa.png" 
            alt="visa" 
            className="w-12 h-8 object-contain"
          />
        </div>
      )
    
    case 'mastercard':
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-red-500 to-red-700 ${className}`}>
          <svg className="w-10 h-6" viewBox="0 0 48 32" fill="none">
            {/* Vrai logo Mastercard */}
            <circle cx="16" cy="16" r="10" fill="#FF5F00"/>
            <circle cx="32" cy="16" r="10" fill="#FF5F00"/>
            <circle cx="16" cy="16" r="10" fill="#EB001B"/>
            <circle cx="32" cy="16" r="10" fill="#F79E1B"/>
            {/* Effet d'intersection correct */}
            <path d="M24 8C20 8 16.5 10 14 13C16.5 16 20 18 24 18C28 18 31.5 16 34 13C31.5 10 28 8 24 8Z" fill="#FF5F00" opacity="0.8"/>
          </svg>
        </div>
      )
    
    case 'amex':
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-blue-700 to-blue-900 ${className}`}>
          <svg className="w-10 h-6" viewBox="0 0 48 32" fill="white">
            {/* Vrai logo AMEX */}
            <rect x="4" y="8" width="40" height="16" rx="2" fill="white"/>
            <text x="24" y="19" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#006FCF">AMEX</text>
          </svg>
        </div>
      )
    
    default:
      return null
  }
}
