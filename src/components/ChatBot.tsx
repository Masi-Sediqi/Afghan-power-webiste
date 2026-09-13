import { FormEvent, useState } from 'react'
import { ArrowUp, ChevronRight, Minimize2, Sparkles, X } from 'lucide-react'

type Message = { id: number; from: 'bot' | 'user'; text: string }

const starters = [
  'Study abroad services',
  'Tourist visa services',
  'Software & databases',
  'Media production',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: 'Welcome to Afghan Power Group. How can we guide you today?' },
  ])

  const send = (text: string) => {
    const value = text.trim()
    if (!value) return
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: 'user', text: value },
      { id: Date.now() + 1, from: 'bot', text: 'Thanks — this is a static design preview. Our live assistant will be connected in the dynamic phase.' },
    ])
    setInput('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(input)
  }

  return (
    <div className={`chatbot-dock ${open ? 'is-open' : ''}`}>
      {open && (
        <section className="chat-panel" aria-label="Afghan Power assistant">
          <div className="chat-panel-head">
            <div className="chat-agent">
              <span className="agent-orb"><img src="/chat-bot-icon.png" alt="" /><i /></span>
              <span><strong>Power Assistant</strong><small><i /> Online · Static Preview</small></span>
            </div>
            <div className="chat-head-actions">
              <button aria-label="Minimize chat" onClick={() => setOpen(false)}><Minimize2 size={16} /></button>
              <button aria-label="Close chat" onClick={() => setOpen(false)}><X size={16} /></button>
            </div>
          </div>

          <div className="chat-body">
            <div className="chat-intro">
              <div className="chat-spark"><Sparkles size={17} /></div>
              <span>AFGHAN POWER GROUP</span>
              <h3>How can we help?</h3>
              <p>Explore our education, travel, technology and media services.</p>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.from}`}>{message.text}</div>
              ))}
            </div>

            <div className="chat-suggestions">
              {starters.map((starter) => (
                <button key={starter} onClick={() => send(starter)}>{starter}<ChevronRight size={14} /></button>
              ))}
            </div>
          </div>

          <form className="chat-input" onSubmit={submit}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Write your message..." />
            <button aria-label="Send message"><ArrowUp size={17} /></button>
          </form>
        </section>
      )}

      <button className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-label="Open Afghan Power assistant">
        <span className="launcher-rings" />
        <span className="launcher-core">{open ? <X size={22} /> : <img src="/chat-bot-icon.png" alt="" />}</span>
        {!open && <span className="launcher-status" />}
      </button>
    </div>
  )
}
