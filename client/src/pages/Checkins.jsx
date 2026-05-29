import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, X, Search, Trash2, Users, CheckCircle2, LogOut, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function Checkins() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({ memberName: '', time: '' })

  const { data: checkins = [], isLoading: isLoadingCheckins } = useQuery({
    queryKey: ['checkins'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/checkins`)
      if (!res.ok) throw new Error('Failed to fetch check-ins')
      return res.json()
    },
  })

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/members`)
      if (!res.ok) throw new Error('Failed to fetch members')
      return res.json()
    },
  })

  const addCheckinMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/api/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add check-in')
      return res.json()
    },
    onSuccess: (newCheckin) => {
      queryClient.setQueryData(['checkins'], (prev = []) => [newCheckin, ...prev])
      setFormData({ memberName: '', time: '' })
      setIsModalOpen(false)
    },
  })

  const checkoutMutation = useMutation({
    mutationFn: async ({ id, check_out }) => {
      const res = await fetch(`${API_URL}/api/checkins/${id}/checkout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ check_out }),
      })
      if (!res.ok) throw new Error('Failed to check out')
      return res.json()
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['checkins'], (prev = []) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/api/checkins/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete check-in')
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['checkins'], (prev = []) => prev.filter((c) => c.id !== id))
    },
  })

  const openModal = () => {
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    setFormData({ memberName: '', time: currentTime })
    setIsModalOpen(true)
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const alreadyCheckedIn = checkins.some((c) => c.member_name === formData.memberName && !c.check_out)
    if (alreadyCheckedIn) { alert('This member is already checked in.'); return }
    const selectedMember = members.find((m) => m.name === formData.memberName)
    addCheckinMutation.mutate({
      member_name: formData.memberName,
      membership: selectedMember?.plan || 'Standard',
      check_in: formData.time,
    })
  }

  const handleCheckout = (id) => {
    const check_out = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    checkoutMutation.mutate({ id, check_out })
  }

  const formatTime = (time) => {
    if (!time) return '-'
    return new Date(`2026-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const filteredCheckins = useMemo(() => {
    return [...checkins]
      .filter((c) => c.member_name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.check_in.localeCompare(a.check_in))
  }, [checkins, search])

  const totalCheckins = checkins.length
  const activeMembers = checkins.filter((c) => !c.check_out).length
  const checkedOutMembers = checkins.filter((c) => c.check_out).length
  const isSubmitting = addCheckinMutation.isPending

  const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Today's Check-ins</h1>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-0.5 rounded-full text-xs font-semibold">{totalCheckins} Total</span>
          </div>
          <p className="text-sm text-slate-400 mt-1">Track member attendance and gym activity</p>
        </div>
        <button onClick={openModal} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
          <Plus size={16} />
          Log Check-in
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Check-ins', value: totalCheckins, icon: Users, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
          { label: 'Active Inside', value: activeMembers, icon: CheckCircle2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Checked Out', value: checkedOutMembers, icon: LogOut, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
        ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium">{label}</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
              </div>
              <div className={`${iconBg} p-3 rounded-xl`}>
                <Icon size={20} className={iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div>Member</div>
          <div>Membership</div>
          <div>Check-in</div>
          <div>Check-out</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoadingCheckins ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-50">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" /><div className="space-y-2"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /><div className="h-3 w-14 bg-slate-100 rounded animate-pulse" /></div></div>
              <div className="flex items-center"><div className="h-5 w-16 bg-slate-100 rounded animate-pulse" /></div>
              <div className="flex items-center"><div className="h-5 w-12 bg-slate-100 rounded animate-pulse" /></div>
              <div className="flex items-center"><div className="h-5 w-12 bg-slate-100 rounded animate-pulse" /></div>
              <div className="flex items-center justify-end gap-2"><div className="h-8 w-20 bg-slate-100 rounded animate-pulse" /></div>
            </div>
          ))
        ) : filteredCheckins.length > 0 ? (
          filteredCheckins.map((checkin) => {
            const isCheckingOut = checkoutMutation.isPending && checkoutMutation.variables?.id === checkin.id
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === checkin.id
            const isRowBusy = isCheckingOut || isDeleting

            return (
              <div
                key={checkin.id}
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-b border-slate-50 last:border-b-0 transition ${isRowBusy ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {checkin.member_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">{checkin.member_name}</h3>
                    <p className="text-xs text-slate-400">Gym Member</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{checkin.membership}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{formatTime(checkin.check_in)}</span>
                </div>
                <div className="flex items-center">
                  {checkin.check_out ? (
                    <span className="font-medium text-sm text-slate-700">{formatTime(checkin.check_out)}</span>
                  ) : (
                    <span className="text-amber-500 text-xs font-semibold">Still Active</span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCheckout(checkin.id)}
                    disabled={!!checkin.check_out || isRowBusy}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center gap-1.5 min-w-[90px] justify-center"
                  >
                    {isCheckingOut ? <><Loader2 size={12} className="animate-spin" /> Saving…</> : checkin.check_out ? 'Checked Out' : 'Check Out'}
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(checkin.id)}
                    disabled={isRowBusy}
                    className="p-2 rounded-lg hover:bg-rose-50 text-rose-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-10 text-center text-sm text-slate-400">No check-ins found</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Log Check-in</h2>
              <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="text-slate-400 hover:text-slate-900 transition disabled:opacity-50">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</label>
                <select name="memberName" value={formData.memberName} onChange={handleChange} required disabled={isSubmitting} className={inputCls}>
                  <option value="">Select member</option>
                  {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-in Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required disabled={isSubmitting} className={inputCls} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-70 flex items-center gap-2 min-w-[120px] justify-center">
                  {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
