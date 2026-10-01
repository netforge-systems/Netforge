function Contact() {
  return (
    <div className="w-full max-w-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Get In Touch</h2>
        <p className="text-slate-400">Have a question or want to collaborate on a project? Send us a message.</p>
      </div>
      
      <form className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input type="text" placeholder="John Doe" className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input type="email" placeholder="john@example.com" className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Message</label>
          <textarea rows={4} placeholder="How can we help you?" className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 resize-none"></textarea>
        </div>
        
        <button type="button" className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-1">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;