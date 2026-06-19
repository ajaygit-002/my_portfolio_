import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { MagneticButton } from '../ui/MagneticButton';
import { Terminal, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Cpu } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaKaggle } from 'react-icons/fa';

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <SectionWrapper id="contact" className="border-t border-white/5 pb-24 relative overflow-hidden">
      {/* Background UI Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="space-y-4 mb-16 text-center">
        <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <Terminal size={14} /> INITIATE_CONNECTION
        </span>
        <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">
          Communication Hub
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto px-4 md:px-0">
        
        {/* Left Column - System Status */}
        <div className="lg:col-span-5 space-y-8 relative">
          <div className="absolute -left-32 -top-32 w-64 h-64 bg-primary/20 rounded-full filter blur-[100px] pointer-events-none" />
          
          <GlassCard className="p-8 border-l-4 border-l-primary bg-bg-dark/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-primary animate-pulse" size={24} />
              <h3 className="font-mono font-bold text-xl uppercase tracking-wider text-white">System Status</h3>
            </div>
            
            <div className="space-y-4 font-mono text-sm text-text-secondary">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>STATUS:</span>
                <span className="text-[#00F5FF] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" /> ONLINE</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>LOCATION:</span>
                <span className="text-white">TAMIL NADU, IN</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>LATENCY:</span>
                <span className="text-secondary">12ms</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span>DIRECT_LINK:</span>
                <a href="mailto:ajay.w@example.com" className="text-primary hover:text-white transition-colors decoration-dashed underline underline-offset-4">ajay.w@example.com</a>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-widest uppercase text-text-muted flex items-center gap-2">
              <span className="w-4 h-[1px] bg-text-muted" /> EXTERNAL_NODES
            </h4>
            <div className="flex items-center gap-4">
              {[
                { icon: <FaGithub size={20} />, href: "https://github.com/ajay", color: "hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]" },
                { icon: <FaLinkedin size={20} />, href: "https://linkedin.com/in/ajay", color: "hover:text-[#0077b5] hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.5)]" },
                { icon: <FaTwitter size={20} />, href: "https://twitter.com/ajay", color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:shadow-[0_0_15px_rgba(29,161,242,0.5)]" },
                { icon: <FaKaggle size={20} />, href: "https://kaggle.com/ajay", color: "hover:text-[#20BEFF] hover:border-[#20BEFF] hover:shadow-[0_0_15px_rgba(32,190,255,0.5)]" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-text-muted transition-all duration-300 backdrop-blur-md ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Terminal Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-1 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border-white/10 relative shadow-glass overflow-hidden">
            {/* Terminal Top Bar */}
            <div className="bg-black/60 px-4 py-3 border-b border-white/5 flex items-center gap-2 backdrop-blur-xl">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 font-mono text-xs text-text-muted">contact_protocol.sh</span>
            </div>

            <div className="p-6 md:p-8 bg-bg-dark/90 backdrop-blur-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Custom AI Terminal Inputs */}
                <div className="space-y-4">
                  
                  {['name', 'email', 'subject'].map((field) => (
                    <div key={field} className="relative group flex flex-col md:flex-row md:items-center gap-2 md:gap-4 font-mono">
                      <label htmlFor={field} className="text-primary text-xs uppercase tracking-wider w-24 shrink-0 flex items-center gap-2">
                        <span className="text-secondary">{'>'}</span> {field}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        id={field}
                        value={form[field]}
                        onChange={handleChange}
                        required={field !== 'subject'}
                        className="flex-1 bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)] transition-all placeholder:text-white/20"
                        placeholder={`Enter ${field}...`}
                      />
                    </div>
                  ))}

                  <div className="relative group flex flex-col gap-2 font-mono pt-2">
                    <label htmlFor="message" className="text-primary text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="text-secondary">{'>'}</span> payload_data
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_15px_rgba(0,245,255,0.1)] transition-all resize-none placeholder:text-white/20"
                      placeholder="Transmission contents..."
                    />
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-end border-t border-white/5">
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={status === 'sending' || status === 'success'}
                      className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden disabled:opacity-50"
                    >
                      {/* Hover gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 font-mono font-bold uppercase tracking-widest text-sm flex items-center gap-3 text-white">
                        {status === 'idle' && (
                          <>
                            <span>Execute</span>
                            <Sparkles size={16} className="text-primary group-hover:text-white" />
                          </>
                        )}
                        {status === 'sending' && (
                          <>
                            <span>Transmitting</span>
                            <Loader2 size={16} className="animate-spin text-primary" />
                          </>
                        )}
                        {status === 'success' && (
                          <>
                            <span>Delivered</span>
                            <CheckCircle2 size={16} className="text-[#00F5FF]" />
                          </>
                        )}
                      </div>
                    </button>
                  </MagneticButton>
                </div>

              </form>
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionWrapper>
  );
};
