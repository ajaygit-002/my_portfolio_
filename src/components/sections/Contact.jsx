import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { GlassCard } from '../ui/GlassCard';
import { MagneticButton } from '../ui/MagneticButton';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaKaggle } from 'react-icons/fa';

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, message: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  // Simple validation checks
  const validateField = (name, value) => {
    let err = '';
    if (!value.trim()) {
      err = 'This field is required.';
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      err = 'Please enter a valid email address.';
    } else if (name === 'name' && value.trim().length < 2) {
      err = 'Name must be at least 2 characters.';
    } else if (name === 'message' && value.trim().length < 10) {
      err = 'Message must be at least 10 characters.';
    }
    return err;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, form[field]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check all fields
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    setTouched({ name: true, email: true, subject: true, message: true });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setStatus('sending');

    try {
      // Simulate form delivery (or plug in Formspree url here)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTouched({ name: false, email: false, subject: false, message: false });
      
      // Reset status to idle after 5s
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <SectionWrapper id="contact" className="border-t border-black/5 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column - Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-primary font-semibold uppercase tracking-[0.3em]">
              GET IN TOUCH
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase tracking-tight text-text-primary leading-tight">
              Let's Build Something Incredible
            </h2>
          </div>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed font-medium">
            Available for full-time roles, freelance contract opportunities, 
            and exciting AI/ML research collaborations. Let's create smart systems together.
          </p>

          <div className="space-y-4 pt-4">
            {/* Email Card */}
            <GlassCard className="p-4 md:p-4 rounded-2xl flex items-center gap-4 hover:border-primary/30">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={18} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-display font-extrabold text-[10px] uppercase tracking-wider text-text-muted">
                  Email Address
                </h4>
                <a
                  href="mailto:ajay.w@example.com"
                  className="text-xs md:text-sm text-text-primary hover:text-primary transition-colors font-semibold break-all"
                >
                  ajay.w@example.com
                </a>
              </div>
            </GlassCard>

            {/* Location Card */}
            <GlassCard className="p-4 md:p-4 rounded-2xl flex items-center gap-4 hover:border-secondary/30">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-[10px] uppercase tracking-wider text-text-muted">
                  Current Location
                </h4>
                <p className="text-xs md:text-sm text-text-primary font-semibold">
                  Tamil Nadu, India
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Social Icons row */}
          <div className="pt-6 space-y-3">
            <h4 className="font-mono text-[10px] tracking-widest uppercase text-text-muted">
              Connect on socials
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ajay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-black/5 bg-black/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all"
                aria-label="GitHub Profile"
              >
                <FaGithub size={16} />
              </a>
              <a
                href="https://linkedin.com/in/ajay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-black/5 bg-black/5 flex items-center justify-center text-slate-400 hover:text-secondary hover:border-secondary/20 transition-all"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="https://twitter.com/ajay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-black/5 bg-black/5 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/20 transition-all"
                aria-label="Twitter Profile"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://kaggle.com/ajay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-black/5 bg-black/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all"
                aria-label="Kaggle Profile"
              >
                <FaKaggle size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Glassmorphism Form */}
        <div className="lg:col-span-7 w-full">
          <GlassCard className="relative p-6 md:p-8 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder=" "
                  required
                  className="block py-3 px-0 w-full text-sm text-text-primary bg-transparent border-0 border-b border-black/10 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-xs text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-mono font-bold"
                >
                  Your Name
                </label>
                {touched.name && errors.name && (
                  <p className="text-[10px] text-red-400 font-mono mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative z-0 w-full group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder=" "
                  required
                  className="block py-3 px-0 w-full text-sm text-text-primary bg-transparent border-0 border-b border-black/10 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-xs text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-mono font-bold"
                >
                  Your Email
                </label>
                {touched.email && errors.email && (
                  <p className="text-[10px] text-red-400 font-mono mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject Input */}
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={() => handleBlur('subject')}
                  placeholder=" "
                  required
                  className="block py-3 px-0 w-full text-sm text-text-primary bg-transparent border-0 border-b border-black/10 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                />
                <label
                  htmlFor="subject"
                  className="peer-focus:font-medium absolute text-xs text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-mono font-bold"
                >
                  Subject
                </label>
                {touched.subject && errors.subject && (
                  <p className="text-[10px] text-red-400 font-mono mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message Input */}
              <div className="relative z-0 w-full group">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  placeholder=" "
                  required
                  className="block py-3 px-0 w-full text-sm text-text-primary bg-transparent border-0 border-b border-black/10 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none"
                />
                <label
                  htmlFor="message"
                  className="peer-focus:font-medium absolute text-xs text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider font-mono font-bold"
                >
                  Your Message
                </label>
                {touched.message && errors.message && (
                  <p className="text-[10px] text-red-400 font-mono mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <MagneticButton className="w-full">
                  <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    className="w-full py-4 rounded-2xl font-display font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-secondary to-primary text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    {status === 'idle' && (
                      <>
                        <span>Send Message</span>
                        <Send size={15} />
                      </>
                    )}
                    {status === 'sending' && (
                      <>
                        <span>Sending...</span>
                        <Loader2 size={15} className="animate-spin" />
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        <span>Message Sent!</span>
                        <CheckCircle2 size={15} className="text-[#10B981]" />
                      </>
                    )}
                  </button>
                </MagneticButton>
              </div>

              {/* Feedback Toasts */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-accent font-mono text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs flex items-center gap-2"
                  >
                    <AlertCircle size={16} />
                    <span>Failed to send. Please try again or email directly.</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </GlassCard>
        </div>

      </div>
    </SectionWrapper>
  );
};
