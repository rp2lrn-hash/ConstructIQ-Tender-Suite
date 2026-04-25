<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const responses = ref([])
const loading = ref(true)
const fetchError = ref('')
const statusFilter = ref('')
const questionnaireFilter = ref('')
const projectFilter = ref('')
const requesterFilter = ref('')
const sortField = ref('last_updated')
const sortDir = ref('desc')
const groupBy = ref('none')

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'reviewed', label: 'Reviewed' }
]

const fetchResponses = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    if (questionnaireFilter.value) params.questionnaire_id = questionnaireFilter.value
    if (projectFilter.value) params.project_id = projectFilter.value

    const response = await api.get('/responses', { params })
    responses.value = response.data
  } catch (error) {
    fetchError.value = error.response?.data?.error || error.message || 'Unknown error'
    console.error('Failed to fetch responses:', fetchError.value)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status) => {
  const colors = {
    not_started: '#9CA3AF',
    in_progress: '#3B82F6',
    completed: '#10B981',
    overdue: '#EF4444',
    reviewed: '#8B5CF6'
  }
  return colors[status] || '#9CA3AF'
}

const getStatusIcon = (status) => {
  const icons = {
    not_started: 'pi-circle',
    in_progress: 'pi-spinner',
    completed: 'pi-check-circle',
    overdue: 'pi-exclamation-circle',
    reviewed: 'pi-eye'
  }
  return icons[status] || 'pi-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue',
    reviewed: 'Reviewed'
  }
  return labels[status] || status
}

const viewDetails = (id) => {
  router.push(`/responses/${id}`)
}

const sendReminder = async (id) => {
  try {
    await api.post(`/responses/${id}/reminder`)
    alert('Reminder sent successfully')
  } catch (error) {
    console.error('Failed to send reminder:', error)
    alert('Failed to send reminder')
  }
}

const printResponse = (id) => {
  window.print()
}

const downloadPDF = async (id) => {
  try {
    const response = await api.get(`/responses/${id}/pdf`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `response-${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Failed to download PDF:', error)
    alert('Failed to download PDF')
  }
}

const calculateProgress = (response) => {
  const answers = response.answer_details || response.AnswerDetails || []
  const q = response.questionnaire || response.Questionnaire
  const totalQuestions = q?.question_count || q?.questions?.length || q?.Questions?.length || 0

  if (totalQuestions > 0) {
    return Math.min(100, Math.round((answers.length / totalQuestions) * 100))
  }

  // Fallback: derive from status when question count isn't available
  const statusProgress = {
    not_started: 0,
    in_progress: 50,
    completed: 100,
    overdue: 30,
    reviewed: 100
  }
  return statusProgress[response.status] ?? 0
}

const filteredSortedResponses = computed(() => {
  let rows = [...responses.value]
  if (requesterFilter.value) {
    rows = rows.filter(r => r.assignment?.assigner?.name?.toLowerCase().includes(requesterFilter.value.toLowerCase()))
  }
  return rows.sort((a, b) => {
    let av, bv
    if (sortField.value === 'title') { av = (a.questionnaire || a.Questionnaire)?.title || ''; bv = (b.questionnaire || b.Questionnaire)?.title || '' }
    else if (sortField.value === 'due_date') { av = new Date(a.assignment?.due_date || 0); bv = new Date(b.assignment?.due_date || 0) }
    else if (sortField.value === 'status') { av = a.status || ''; bv = b.status || '' }
    else { av = new Date(a.last_updated || a.created_at || 0); bv = new Date(b.last_updated || b.created_at || 0) }
    return sortDir.value === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })
})

const groupedResponses = computed(() => {
  if (groupBy.value === 'none') return null
  const groups = {}
  for (const r of filteredSortedResponses.value) {
    let key
    if (groupBy.value === 'questionnaire') key = (r.questionnaire || r.Questionnaire)?.title || 'Unknown'
    else if (groupBy.value === 'requester') key = r.assignment?.assigner?.name || 'No Requester'
    else if (groupBy.value === 'status') key = getStatusLabel(r.status)
    groups[key] = groups[key] || []
    groups[key].push(r)
  }
  return groups
})

onMounted(() => {
  fetchResponses()
})
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="rl-title">Responses</h1>
        <p class="rl-sub">View and manage questionnaire responses</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="rl-toolbar">
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="f in statusOptions"
          :key="f.value"
          @click="statusFilter = f.value; fetchResponses()"
          class="rl-pill"
          :class="statusFilter === f.value ? 'rl-pill-active' : ''"
        >{{ f.label }}</button>
      </div>
      <div class="flex gap-2 flex-wrap items-center ml-auto">
        <div class="rl-ctrl-wrap">
          <i class="pi pi-search rl-ctrl-icon"></i>
          <input v-model="requesterFilter" placeholder="Filter by requester…" class="rl-ctrl-input" />
        </div>
        <div class="rl-ctrl-wrap">
          <i class="pi pi-sort-alt rl-ctrl-icon"></i>
          <select v-model="sortField" class="rl-ctrl-select">
            <option value="last_updated">Sort: Last Updated</option>
            <option value="title">Sort: Title</option>
            <option value="due_date">Sort: Due Date</option>
            <option value="status">Sort: Status</option>
          </select>
          <button @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'" class="rl-dir-btn">
            <i :class="['pi', sortDir === 'asc' ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down']" style="font-size:12px;"></i>
          </button>
        </div>
        <div class="rl-ctrl-wrap">
          <i class="pi pi-table rl-ctrl-icon"></i>
          <select v-model="groupBy" class="rl-ctrl-select">
            <option value="none">Group: None</option>
            <option value="questionnaire">Group: Questionnaire</option>
            <option value="requester">Group: Requester</option>
            <option value="status">Group: Status</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="ql-table-wrap">
      <div class="ql-thead"></div>
      <div v-for="i in 5" :key="i" class="ql-skel"></div>
    </div>

    <!-- Error -->
    <div v-else-if="fetchError" class="rl-empty">
      <div class="rl-empty-icon" style="background:linear-gradient(135deg,#EF4444,#DC2626);">
        <i class="pi pi-exclamation-triangle text-2xl text-white"></i>
      </div>
      <h2 class="rl-empty-title">Failed to load responses</h2>
      <p class="rl-empty-sub" style="color:#EF4444;">{{ fetchError }}</p>
      <button @click="fetchResponses" class="rl-retry-btn">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="responses.length === 0" class="rl-empty">
      <div class="rl-empty-icon"><i class="pi pi-reply text-2xl text-white"></i></div>
      <h2 class="rl-empty-title">No Responses Found</h2>
      <p class="rl-empty-sub">There are no questionnaire responses to display.</p>
    </div>

    <!-- Table -->
    <div v-else class="ql-table-wrap">

      <!-- Header row -->
      <div class="ql-thead">
        <div class="ql-th" style="flex:2">Questionnaire</div>
        <div class="ql-th" style="flex:1.2">Status</div>
        <div class="ql-th" style="flex:1.2">Progress</div>
        <div class="ql-th" style="flex:1.5">Requested By</div>
        <div class="ql-th" style="flex:1.2">Assigned Date</div>
        <div class="ql-th" style="flex:1.2">Due Date</div>
        <div class="ql-th" style="flex:0.8; justify-content:flex-end">Actions</div>
      </div>

      <!-- Grouped rows -->
      <template v-if="groupedResponses">
        <template v-for="(groupRows, groupKey) in groupedResponses" :key="groupKey">
          <div class="rl-group-header">
            <i class="pi pi-folder" style="font-size:11px; margin-right:6px;"></i>
            {{ groupKey }}
            <span class="rl-group-count">{{ groupRows.length }}</span>
          </div>
          <div
            v-for="(response, index) in groupRows"
            :key="response.id"
            class="ql-row"
            :class="index % 2 === 1 ? 'ql-row-alt' : ''"
          >
            <div class="ql-accent" :style="{ background: `linear-gradient(180deg, ${getStatusColor(response.status)}, ${getStatusColor(response.status)}99)` }"></div>
            <div class="ql-cell" style="flex:2"><div><p class="ql-row-title">{{ (response.questionnaire || response.Questionnaire)?.title || 'Untitled' }}</p></div></div>
            <div class="ql-cell" style="flex:1.2"><span class="ql-badge" :style="{ background: `${getStatusColor(response.status)}18`, color: getStatusColor(response.status) }"><span class="ql-dot"></span>{{ getStatusLabel(response.status) }}</span></div>
            <div class="ql-cell" style="flex:1.2"><div class="rl-progress-wrap"><div class="rl-progress-track"><div class="rl-progress-fill" :style="{ width: `${calculateProgress(response)}%`, background: getStatusColor(response.status) }"></div></div><span class="rl-progress-pct" :style="{ color: getStatusColor(response.status) }">{{ calculateProgress(response) }}%</span></div></div>
            <div class="ql-cell" style="flex:1.5"><div v-if="response.assignment?.assigner" class="flex items-center gap-2"><div class="ql-avatar" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED)">{{ response.assignment.assigner.name?.charAt(0) || 'U' }}</div><span class="ql-creator-name">{{ response.assignment.assigner.name }}</span></div><span v-else class="ql-date">—</span></div>
            <div class="ql-cell" style="flex:1.2"><span class="ql-date">{{ response.assignment?.created_at ? new Date(response.assignment.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—' }}</span></div>
            <div class="ql-cell" style="flex:1.2"><span v-if="response.assignment?.due_date" class="ql-date" :style="{color: new Date(response.assignment.due_date)<new Date()&&response.status!=='completed'?'#EF4444':'#64748B'}">{{ new Date(response.assignment.due_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) }}</span><span v-else class="ql-date">—</span></div>
            <div class="ql-cell" style="flex:0.8; justify-content:flex-end"><div class="flex gap-1.5"><button @click="viewDetails(response.id)" class="ql-action-btn" style="color:#6366F1;background:rgba(99,102,241,0.1);"><i class="pi pi-eye" style="font-size:11px;"></i></button><button @click="sendReminder(response.id)" class="ql-action-btn" style="color:#F59E0B;background:rgba(245,158,11,0.1);"><i class="pi pi-bell" style="font-size:11px;"></i></button></div></div>
          </div>
        </template>
      </template>

      <!-- Flat rows -->
      <div
        v-else
        v-for="(response, index) in filteredSortedResponses"
        :key="response.id"
        class="ql-row"
        :class="index % 2 === 1 ? 'ql-row-alt' : ''"
      >
        <!-- Accent bar coloured by status -->
        <div class="ql-accent" :style="{ background: `linear-gradient(180deg, ${getStatusColor(response.status)}, ${getStatusColor(response.status)}99)` }"></div>

        <!-- Questionnaire title -->
        <div class="ql-cell" style="flex:2">
          <div>
            <p class="ql-row-title">{{ (response.questionnaire || response.Questionnaire)?.title || 'Untitled' }}</p>
          </div>
        </div>

        <!-- Status badge -->
        <div class="ql-cell" style="flex:1.2">
          <span class="ql-badge" :style="{ background: `${getStatusColor(response.status)}18`, color: getStatusColor(response.status) }">
            <span class="ql-dot"></span>
            {{ getStatusLabel(response.status) }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="ql-cell" style="flex:1.2">
          <div class="rl-progress-wrap">
            <div class="rl-progress-track">
              <div class="rl-progress-fill" :style="{ width: `${calculateProgress(response)}%`, background: getStatusColor(response.status) }"></div>
            </div>
            <span class="rl-progress-pct" :style="{ color: getStatusColor(response.status) }">{{ calculateProgress(response) }}%</span>
          </div>
        </div>

        <!-- Requested By (assigner only) -->
        <div class="ql-cell" style="flex:1.5">
          <div v-if="response.assignment?.assigner" class="flex items-center gap-2">
            <div class="ql-avatar" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED)">{{ response.assignment.assigner.name?.charAt(0) || 'U' }}</div>
            <span class="ql-creator-name">{{ response.assignment.assigner.name }}</span>
          </div>
          <span v-else class="ql-date">—</span>
        </div>

        <!-- Assigned Date -->
        <div class="ql-cell" style="flex:1.2">
          <span class="ql-date">{{ response.assignment?.created_at ? new Date(response.assignment.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—' }}</span>
        </div>

        <!-- Due Date -->
        <div class="ql-cell" style="flex:1.2">
          <span v-if="response.assignment?.due_date" class="ql-date" :style="{ color: new Date(response.assignment.due_date) < new Date() && response.status !== 'completed' ? '#EF4444' : '#64748B' }">
            {{ new Date(response.assignment.due_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) }}
          </span>
          <span v-else class="ql-date">—</span>
        </div>


        <!-- Actions -->
        <div class="ql-cell" style="flex:0.8; justify-content:flex-end">
          <div class="flex gap-1.5">
            <button @click="viewDetails(response.id)" class="ql-action-btn" title="View Details" style="color:#6366F1; background:rgba(99,102,241,0.1);">
              <i class="pi pi-eye" style="font-size:11px;"></i>
            </button>
            <button @click="sendReminder(response.id)" class="ql-action-btn" title="Send Reminder" style="color:#F59E0B; background:rgba(245,158,11,0.1);">
              <i class="pi pi-bell" style="font-size:11px;"></i>
            </button>
            <button @click="downloadPDF(response.id)" class="ql-action-btn" title="Download PDF" style="color:#10B981; background:rgba(16,185,129,0.1);">
              <i class="pi pi-download" style="font-size:11px;"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.rl-title {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(135deg, #4F46E5, #7C3AED, #0EA5E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.rl-sub { font-size: 13px; color: #94A3B8; margin-top: 2px; }

/* Pills */
.rl-pill {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1.5px solid #E2E8F0;
  background: white;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}
.rl-pill:hover { border-color: #6366F1; color: #6366F1; }
.rl-pill-active { background: linear-gradient(135deg,#6366F1,#8B5CF6); color: white !important; border-color: transparent; box-shadow: 0 3px 10px rgba(99,102,241,0.3); }

/* Table — reuse ql- classes from global or redeclare */
.ql-table-wrap {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(99,102,241,0.08);
  border: 1.5px solid #E8EAFF;
}
.ql-thead {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 52px;
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%);
  gap: 8px;
}
.ql-th {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.7);
  cursor: default;
  user-select: none;
  flex: 1;
}
.ql-row {
  display: flex;
  align-items: center;
  padding: 0 20px;
  min-height: 60px;
  gap: 8px;
  position: relative;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s ease;
}
.ql-row:hover { background: #F8F9FF; }
.ql-row-alt { background: #FAFBFF; }
.ql-row-alt:hover { background: #F0F2FF; }
.ql-accent {
  position: absolute;
  left: 0; top: 10px; bottom: 10px;
  width: 3px;
  border-radius: 0 3px 3px 0;
}
.ql-cell { display: flex; align-items: center; flex: 1; }
.ql-row-title { font-size: 13px; font-weight: 700; color: #0F172A; }
.ql-row-desc { font-size: 11px; color: #94A3B8; margin-top: 2px; }
.ql-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}
.ql-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.ql-date { font-size: 12px; color: #64748B; font-weight: 600; }
.ql-avatar {
  width: 26px; height: 26px;
  border-radius: 8px;
  background: linear-gradient(135deg,#6366F1,#06B6D4);
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ql-creator-name { font-size: 12px; color: #475569; font-weight: 600; }
.ql-action-btn {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.ql-action-btn:hover { transform: scale(1.1); }
.ql-skel {
  height: 60px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E8EAFF 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-bottom: 1px solid #F1F5F9;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* Progress */
.rl-progress-wrap { display: flex; align-items: center; gap: 8px; width: 100%; }
.rl-progress-track { flex: 1; height: 6px; border-radius: 999px; background: #E8EAFF; overflow: hidden; }
.rl-progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
.rl-progress-pct { font-size: 11px; font-weight: 700; min-width: 32px; text-align: right; }

/* Toolbar */
.rl-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
}
.rl-ctrl-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 5px 10px;
  height: 34px;
}
.rl-ctrl-icon { font-size: 12px; color: #94A3B8; }
.rl-ctrl-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  color: #0F172A;
  width: 150px;
}
.rl-ctrl-input::placeholder { color: #94A3B8; }
.rl-ctrl-select {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.rl-dir-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6366F1;
  padding: 0 2px;
  display: flex;
  align-items: center;
}
.rl-group-header {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #6366F1;
  background: linear-gradient(90deg, rgba(99,102,241,0.06), transparent);
  border-bottom: 1px solid #E8EAFF;
}
.rl-group-count {
  margin-left: 8px;
  background: rgba(99,102,241,0.12);
  color: #6366F1;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
}

/* Empty state */
.rl-empty { text-align: center; padding: 64px 24px; }
.rl-empty-icon {
  width: 64px; height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.rl-empty-title { font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
.rl-empty-sub { font-size: 13px; color: #94A3B8; }
.rl-retry-btn {
  margin-top: 16px;
  padding: 8px 20px;
  border-radius: 10px;
  background: #EEF2FF;
  color: #6366F1;
  font-weight: 700;
  font-size: 13px;
  border: none;
  cursor: pointer;
}
</style>
