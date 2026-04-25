<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const questionnaires = ref([])
const loading = ref(true)
const statusFilter = ref('all')
const sortColumn = ref('created_at')
const sortDirection = ref('desc')
const groupBy = ref('none')
const sortField = ref('created_at')
const sortDir = ref('desc')
const assigneeFilter = ref('')

// Edit modal
const showEditModal = ref(false)
const editSaving = ref(false)
const editPreviewMode = ref(false)
const editForm = ref({ id: null, title: '', description: '', is_active: true })
const editQuestions = ref([])
const editAssignUser = ref(null)
const editDueDate = ref('')
const editAssignNotes = ref('')
const availableUsers = ref([])
const loadingUsers = ref(false)

const questionTypes = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'file_upload', label: 'File Upload' },
]

const fetchUsers = async () => {
  if (availableUsers.value.length) return
  loadingUsers.value = true
  try {
    const res = await api.get('/assignments/users')
    availableUsers.value = res.data
  } catch (e) { console.error(e) } finally { loadingUsers.value = false }
}

const addEditQuestion = () => {
  editQuestions.value.push({ id: Date.now(), question_text: '', question_type: 'text', options: [], is_required: false, order_index: editQuestions.value.length })
}
const removeEditQuestion = (i) => { editQuestions.value.splice(i, 1); editQuestions.value.forEach((q, idx) => q.order_index = idx) }
const addEditOption = (q) => { if (!q.options) q.options = []; q.options.push('') }
const removeEditOption = (q, i) => { q.options.splice(i, 1) }
const moveEditUp = (i) => { if (i > 0) { const t = editQuestions.value[i]; editQuestions.value[i] = editQuestions.value[i-1]; editQuestions.value[i-1] = t; editQuestions.value.forEach((q,idx) => q.order_index=idx) } }
const moveEditDown = (i) => { if (i < editQuestions.value.length-1) { const t = editQuestions.value[i]; editQuestions.value[i] = editQuestions.value[i+1]; editQuestions.value[i+1] = t; editQuestions.value.forEach((q,idx) => q.order_index=idx) } }

const flatRows = computed(() => {
  const rows = []
  for (const q of sortedQuestionnaires.value) {
    if (q.assignments && q.assignments.length > 0) {
      for (const a of q.assignments) {
        rows.push({ questionnaire: q, assignment: a })
      }
    } else {
      rows.push({ questionnaire: q, assignment: null })
    }
  }
  // Assignee filter
  const filtered = assigneeFilter.value
    ? rows.filter(r => r.assignment?.assignee?.name?.toLowerCase().includes(assigneeFilter.value.toLowerCase()))
    : rows
  // Sort
  return [...filtered].sort((a, b) => {
    let av, bv
    if (sortField.value === 'title') { av = a.questionnaire.title; bv = b.questionnaire.title }
    else if (sortField.value === 'due_date') { av = new Date(a.assignment?.due_date || 0); bv = new Date(b.assignment?.due_date || 0) }
    else if (sortField.value === 'status') { av = a.assignment?.status || ''; bv = b.assignment?.status || '' }
    else { av = new Date(a.questionnaire.created_at); bv = new Date(b.questionnaire.created_at) }
    return sortDir.value === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })
})

const groupedRows = computed(() => {
  if (groupBy.value === 'none') return null
  const groups = {}
  for (const row of flatRows.value) {
    let key
    if (groupBy.value === 'questionnaire') key = row.questionnaire.title
    else if (groupBy.value === 'assignee') key = row.assignment?.assignee?.name || 'Unassigned'
    else if (groupBy.value === 'status') key = row.assignment?.status || 'No assignment'
    groups[key] = groups[key] || []
    groups[key].push(row)
  }
  return groups
})

const sortedQuestionnaires = computed(() => {
  return [...questionnaires.value].sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    if (sortColumn.value === 'created_at') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
})

const fetchQuestionnaires = async () => {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value !== 'all') params.is_active = statusFilter.value === 'active'

    const response = await api.get('/questionnaires', { params })
    console.log('Fetched questionnaires:', response.data)
    questionnaires.value = response.data
  } catch (error) {
    console.error('Failed to fetch questionnaires:', error)
  } finally {
    loading.value = false
  }
}

const createQuestionnaire = () => {
  editForm.value = { id: null, title: '', description: '', is_active: true }
  editQuestions.value = []
  editAssignUser.value = null
  editDueDate.value = ''
  editAssignNotes.value = ''
  editPreviewMode.value = false
  showEditModal.value = true
  fetchUsers()
}

const editQuestionnaire = async (q) => {
  editForm.value = { id: q.id, title: q.title, description: q.description || '', is_active: q.is_active }
  editQuestions.value = []
  editAssignUser.value = null
  editDueDate.value = ''
  editAssignNotes.value = ''
  editPreviewMode.value = false
  showEditModal.value = true
  fetchUsers()
  try {
    const res = await api.get(`/questionnaires/${q.id}`)
    const data = res.data
    editForm.value = { id: data.id, title: data.title, description: data.description || '', is_active: data.is_active }
    editQuestions.value = (data.questions || []).map(q => ({ id: q.id, question_text: q.question_text, question_type: q.question_type, options: q.options || [], is_required: q.is_required, order_index: q.order_index }))
  } catch (e) { console.error('Failed to load questionnaire detail', e) }
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveEdit = async () => {
  if (!editForm.value.title.trim()) { alert('Title is required.'); return }
  editSaving.value = true
  try {
    const payload = {
      title: editForm.value.title,
      description: editForm.value.description,
      is_active: editForm.value.is_active,
      questions: editQuestions.value.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options?.length ? q.options : null,
        is_required: q.is_required,
        order_index: q.order_index
      }))
    }
    let qId = editForm.value.id
    if (qId) {
      await api.put(`/questionnaires/${qId}`, payload)
    } else {
      const res = await api.post('/questionnaires', payload)
      qId = res.data.id
    }
    if (editAssignUser.value) {
      await api.post('/assignments', {
        questionnaire_id: qId,
        assigned_to: editAssignUser.value,
        due_date: editDueDate.value || null,
        notes: editAssignNotes.value || null
      })
    }
    showEditModal.value = false
    await fetchQuestionnaires()
  } catch (error) {
    console.error('Failed to save questionnaire:', error)
    alert('Failed to save. Please try again.')
  } finally {
    editSaving.value = false
  }
}

const toggleStatus = async (id, isActive) => {
  try {
    await api.patch(`/questionnaires/${id}/status`, { is_active: !isActive })
    await fetchQuestionnaires()
  } catch (error) {
    console.error('Failed to toggle status:', error)
    alert('Failed to update questionnaire status')
  }
}

const deleteQuestionnaire = async (id) => {
  if (!confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
    return
  }

  try {
    await api.delete(`/questionnaires/${id}`)
    await fetchQuestionnaires()
  } catch (error) {
    console.error('Failed to delete questionnaire:', error)
    alert('Failed to delete questionnaire')
  }
}

const getQuestionCount = (questionnaire) => {
  return questionnaire.questions?.length || 0
}

const handleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return 'pi-sort'
  return sortDirection.value === 'asc' ? 'pi-sort-up' : 'pi-sort-down'
}

onMounted(() => {
  fetchQuestionnaires()
})
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="ql-title">Questionnaires</h1>
        <p class="ql-sub">Manage your questionnaire templates</p>
      </div>
      <button @click="createQuestionnaire" class="ql-create-btn">
        <i class="pi pi-plus text-xs mr-1.5"></i> Create Questionnaire
      </button>
    </div>

    <!-- Toolbar: status pills + sort + filter + group-by -->
    <div class="ql-toolbar">
      <!-- Status filter pills -->
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="f in [{ label: 'All', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]"
          :key="f.value"
          @click="statusFilter = f.value; fetchQuestionnaires()"
          class="ql-pill"
          :class="statusFilter === f.value ? 'ql-pill-active' : ''"
        >{{ f.label }}</button>
      </div>

      <div class="flex gap-2 flex-wrap items-center ml-auto">
        <!-- Search / filter by assignee -->
        <div class="ql-ctrl-wrap">
          <i class="pi pi-search ql-ctrl-icon"></i>
          <input v-model="assigneeFilter" placeholder="Filter by assignee…" class="ql-ctrl-input" />
        </div>

        <!-- Sort by -->
        <div class="ql-ctrl-wrap">
          <i class="pi pi-sort-alt ql-ctrl-icon"></i>
          <select v-model="sortField" class="ql-ctrl-select">
            <option value="created_at">Sort: Created Date</option>
            <option value="title">Sort: Title</option>
            <option value="due_date">Sort: Due Date</option>
            <option value="status">Sort: Status</option>
          </select>
          <button @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'" class="ql-dir-btn" :title="sortDir === 'asc' ? 'Ascending' : 'Descending'">
            <i :class="['pi', sortDir === 'asc' ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down']" style="font-size:12px;"></i>
          </button>
        </div>

        <!-- Group by -->
        <div class="ql-ctrl-wrap">
          <i class="pi pi-table ql-ctrl-icon"></i>
          <select v-model="groupBy" class="ql-ctrl-select">
            <option value="none">Group: None</option>
            <option value="questionnaire">Group: Questionnaire</option>
            <option value="assignee">Group: Assignee</option>
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

    <!-- Empty state -->
    <div v-else-if="questionnaires.length === 0" class="ql-empty">
      <div class="ql-empty-icon"><i class="pi pi-file-edit text-3xl text-white"></i></div>
      <h2 class="ql-empty-title">No Questionnaires Yet</h2>
      <p class="ql-empty-sub">Create your first questionnaire to get started.</p>
    </div>

    <!-- Premium Table -->
    <div v-else class="ql-table-wrap">

      <!-- Header row -->
      <div class="ql-thead">
        <div class="ql-th" style="flex:2.5" @click="handleSort('title')">
          Title <i :class="['pi', getSortIcon('title'), 'ml-1 text-xs opacity-60']"></i>
        </div>
        <div class="ql-th" style="flex:1.2" @click="handleSort('is_active')">
          Status <i :class="['pi', getSortIcon('is_active'), 'ml-1 text-xs opacity-60']"></i>
        </div>
        <div class="ql-th" style="flex:1.4">
          Progress
        </div>
        <div class="ql-th" style="flex:1.8">
          Created By
        </div>
        <div class="ql-th" style="flex:1.5">
          Assigned To
        </div>
        <div class="ql-th" style="flex:1.2">
          Assigned Date
        </div>
        <div class="ql-th" style="flex:1.2">
          Due Date
        </div>
        <div class="ql-th" style="flex:0.8; justify-content:flex-end">
          Actions
        </div>
      </div>

      <!-- Group-by section headers + rows -->
      <template v-if="groupedRows">
        <template v-for="(groupRows, groupKey) in groupedRows" :key="groupKey">
          <div class="ql-group-header">
            <i class="pi pi-folder" style="font-size:11px; margin-right:6px;"></i>
            {{ groupKey }}
            <span class="ql-group-count">{{ groupRows.length }}</span>
          </div>
          <div
            v-for="(row, index) in groupRows"
            :key="`${row.questionnaire.id}-${row.assignment?.id ?? 'none'}`"
            class="ql-row"
            :class="index % 2 === 1 ? 'ql-row-alt' : ''"
          >
            <div class="ql-accent" :style="{ background: row.questionnaire.is_active ? 'linear-gradient(180deg,#6366F1,#8B5CF6)' : 'linear-gradient(180deg,#94A3B8,#CBD5E1)' }"></div>
            <div style="flex:2.5" class="ql-cell"><p class="ql-row-title">{{ row.questionnaire.title }}</p></div>
            <div style="flex:1.2" class="ql-cell"><span class="ql-badge" :class="row.questionnaire.is_active ? 'ql-badge-active' : 'ql-badge-inactive'"><span class="ql-dot"></span>{{ row.questionnaire.is_active ? 'Active' : 'Inactive' }}</span></div>
            <div style="flex:1.4" class="ql-cell">
              <span v-if="!row.assignment" class="ql-date">—</span>
              <div v-else class="rl-progress-wrap"><div class="rl-progress-track"><div class="rl-progress-fill" :style="{ width: row.assignment.status === 'completed' ? '100%' : row.assignment.status === 'in_progress' ? '50%' : '0%', background: 'linear-gradient(90deg,#6366F1,#8B5CF6)' }"></div></div><span class="rl-progress-pct" style="color:#6366F1">{{ row.assignment.status === 'completed' ? '100' : row.assignment.status === 'in_progress' ? '50' : '0' }}%</span></div>
            </div>
            <div style="flex:1.8" class="ql-cell"><div v-if="row.questionnaire.creator" class="flex items-center gap-2"><div class="ql-avatar" style="background:linear-gradient(135deg,#F59E0B,#D97706)">{{ row.questionnaire.creator.name?.charAt(0) || 'U' }}</div><span class="ql-creator-name">{{ row.questionnaire.creator.name }}</span></div><span v-else class="ql-date">—</span></div>
            <div style="flex:1.5" class="ql-cell"><div v-if="row.assignment?.assignee" class="flex items-center gap-1.5"><div class="ql-avatar" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED)">{{ row.assignment.assignee.name?.charAt(0) || '?' }}</div><span class="ql-creator-name">{{ row.assignment.assignee.name }}</span></div><span v-else class="ql-date">—</span></div>
            <div style="flex:1.2" class="ql-cell"><span class="ql-date">{{ row.assignment?.created_at ? new Date(row.assignment.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—' }}</span></div>
            <div style="flex:1.2" class="ql-cell"><span v-if="row.assignment?.due_date" class="ql-date" :style="{ color: new Date(row.assignment.due_date) < new Date() && row.assignment.status !== 'completed' ? '#EF4444' : '#64748B' }">{{ new Date(row.assignment.due_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) }}</span><span v-else class="ql-date">—</span></div>
            <div class="ql-cell" style="justify-content:flex-end; flex:0.8"><div class="flex gap-1.5"><button @click="editQuestionnaire(row.questionnaire)" class="ql-action-btn" style="color:#6366F1;background:rgba(99,102,241,0.1)"><i class="pi pi-pencil" style="font-size:11px"></i></button><button @click="toggleStatus(row.questionnaire.id,row.questionnaire.is_active)" class="ql-action-btn" :style="row.questionnaire.is_active?'color:#F59E0B;background:rgba(245,158,11,0.1)':'color:#10B981;background:rgba(16,185,129,0.1)'"><i :class="['pi',row.questionnaire.is_active?'pi-pause':'pi-play']" style="font-size:11px"></i></button><button @click="deleteQuestionnaire(row.questionnaire.id)" class="ql-action-btn" style="color:#EF4444;background:rgba(239,68,68,0.1)"><i class="pi pi-trash" style="font-size:11px"></i></button></div></div>
          </div>
        </template>
      </template>

      <!-- Body rows: one row per assignment -->
      <div
        v-else
        v-for="(row, index) in flatRows"
        :key="`${row.questionnaire.id}-${row.assignment?.id ?? 'none'}`"
        class="ql-row"
        :class="index % 2 === 1 ? 'ql-row-alt' : ''"
      >
        <!-- Accent bar -->
        <div class="ql-accent" :style="{ background: row.questionnaire.is_active ? 'linear-gradient(180deg,#6366F1,#8B5CF6)' : 'linear-gradient(180deg,#94A3B8,#CBD5E1)' }"></div>

        <!-- Title -->
        <div style="flex:2.5" class="ql-cell">
          <p class="ql-row-title">{{ row.questionnaire.title }}</p>
        </div>

        <!-- Status -->
        <div style="flex:1.2" class="ql-cell">
          <span class="ql-badge" :class="row.questionnaire.is_active ? 'ql-badge-active' : 'ql-badge-inactive'">
            <span class="ql-dot"></span>
            {{ row.questionnaire.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <!-- Progress -->
        <div style="flex:1.4" class="ql-cell">
          <span v-if="!row.assignment" class="ql-date">—</span>
          <div v-else class="rl-progress-wrap">
            <div class="rl-progress-track">
              <div class="rl-progress-fill" :style="{ width: row.assignment.status === 'completed' ? '100%' : row.assignment.status === 'in_progress' ? '50%' : '0%', background: 'linear-gradient(90deg,#6366F1,#8B5CF6)' }"></div>
            </div>
            <span class="rl-progress-pct" style="color:#6366F1">{{ row.assignment.status === 'completed' ? '100' : row.assignment.status === 'in_progress' ? '50' : '0' }}%</span>
          </div>
        </div>

        <!-- Created By -->
        <div style="flex:1.8" class="ql-cell">
          <div v-if="row.questionnaire.creator" class="flex items-center gap-2">
            <div class="ql-avatar" style="background:linear-gradient(135deg,#F59E0B,#D97706)">{{ row.questionnaire.creator.name?.charAt(0) || 'U' }}</div>
            <span class="ql-creator-name">{{ row.questionnaire.creator.name }}</span>
          </div>
          <span v-else class="ql-date">—</span>
        </div>

        <!-- Assigned To -->
        <div style="flex:1.5" class="ql-cell">
          <div v-if="row.assignment?.assignee" class="flex items-center gap-1.5">
            <div class="ql-avatar" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED)">{{ row.assignment.assignee.name?.charAt(0) || '?' }}</div>
            <span class="ql-creator-name">{{ row.assignment.assignee.name }}</span>
          </div>
          <span v-else class="ql-date">—</span>
        </div>

        <!-- Assigned Date -->
        <div style="flex:1.2" class="ql-cell">
          <span class="ql-date">{{ row.assignment?.created_at ? new Date(row.assignment.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—' }}</span>
        </div>

        <!-- Due Date -->
        <div style="flex:1.2" class="ql-cell">
          <span v-if="row.assignment?.due_date" class="ql-date" :style="{ color: new Date(row.assignment.due_date) < new Date() && row.assignment.status !== 'completed' ? '#EF4444' : '#64748B' }">
            {{ new Date(row.assignment.due_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) }}
          </span>
          <span v-else class="ql-date">—</span>
        </div>

        <!-- Actions -->
        <div class="ql-cell" style="justify-content:flex-end; flex:0.8">
          <div class="flex gap-1.5">
            <button @click="editQuestionnaire(row.questionnaire)" class="ql-action-btn" title="Edit" style="color:#6366F1; background:rgba(99,102,241,0.1);">
              <i class="pi pi-pencil" style="font-size:11px;"></i>
            </button>
            <button
              @click="toggleStatus(row.questionnaire.id, row.questionnaire.is_active)"
              class="ql-action-btn"
              :title="row.questionnaire.is_active ? 'Deactivate' : 'Activate'"
              :style="row.questionnaire.is_active ? 'color:#F59E0B;background:rgba(245,158,11,0.1)' : 'color:#10B981;background:rgba(16,185,129,0.1)'"
            >
              <i :class="['pi', row.questionnaire.is_active ? 'pi-pause' : 'pi-play']" style="font-size:11px;"></i>
            </button>
            <button @click="deleteQuestionnaire(row.questionnaire.id)" class="ql-action-btn" title="Delete" style="color:#EF4444; background:rgba(239,68,68,0.1);">
              <i class="pi pi-trash" style="font-size:11px;"></i>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Edit Modal (full slide-over) -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
          <div class="modal-box">

            <!-- Header -->
            <div class="modal-header">
              <div class="flex items-center gap-3">
                <div class="modal-icon"><i :class="editForm.id ? 'pi pi-pencil' : 'pi pi-plus'" class="text-white text-sm"></i></div>
                <div>
                  <h2 class="modal-title">{{ editForm.id ? 'Edit Questionnaire' : 'New Questionnaire' }}</h2>
                  <p class="modal-sub">{{ editForm.id ? (editForm.title || 'Untitled') : 'Fill in the details below' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="editPreviewMode = !editPreviewMode" class="modal-preview-btn">
                  <i :class="editPreviewMode ? 'pi pi-pencil' : 'pi pi-eye'" style="font-size:11px;"></i>
                  {{ editPreviewMode ? 'Edit' : 'Preview' }}
                </button>
                <button @click="closeEditModal" class="modal-close"><i class="pi pi-times"></i></button>
              </div>
            </div>

            <!-- Scrollable body -->
            <div class="modal-body">

              <!-- ── EDIT VIEW ── -->
              <template v-if="!editPreviewMode">

                <!-- Details -->
                <div class="modal-section">
                  <p class="modal-section-title">Details</p>
                  <div class="modal-field">
                    <label class="modal-label">Title <span style="color:#EF4444">*</span></label>
                    <input v-model="editForm.title" type="text" class="modal-input" placeholder="Questionnaire title" />
                  </div>
                  <div class="modal-field">
                    <label class="modal-label">Description</label>
                    <textarea v-model="editForm.description" rows="3" class="modal-input" style="resize:none;" placeholder="Optional description"></textarea>
                  </div>
                  <div class="modal-field">
                    <label class="modal-label">Status</label>
                    <div class="flex gap-3">
                      <button @click="editForm.is_active = true" class="modal-status-btn" :class="editForm.is_active ? 'modal-status-active' : 'modal-status-inactive'">
                        <span class="modal-status-dot"></span> Active
                      </button>
                      <button @click="editForm.is_active = false" class="modal-status-btn" :class="!editForm.is_active ? 'modal-status-off' : 'modal-status-inactive'">
                        <span class="modal-status-dot"></span> Inactive
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Assignment -->
                <div class="modal-section">
                  <p class="modal-section-title">Assign to User <span style="color:#94A3B8;font-weight:500;">(Optional)</span></p>
                  <div class="modal-field">
                    <label class="modal-label">Assign To</label>
                    <select v-model="editAssignUser" class="modal-input">
                      <option value="">Select a user...</option>
                      <option v-if="loadingUsers" disabled>Loading...</option>
                      <option v-for="u in availableUsers" :key="u.id" :value="u.id">{{ u.name }} ({{ u.email }})</option>
                    </select>
                  </div>
                  <div class="modal-field">
                    <label class="modal-label">Due Date</label>
                    <input v-model="editDueDate" type="date" class="modal-input" />
                  </div>
                  <div class="modal-field">
                    <label class="modal-label">Notes</label>
                    <textarea v-model="editAssignNotes" rows="2" class="modal-input" style="resize:none;" placeholder="Notes for the assignee..."></textarea>
                  </div>
                </div>

                <!-- Questions -->
                <div class="modal-section">
                  <div class="flex items-center justify-between mb-3">
                    <p class="modal-section-title" style="margin-bottom:0">Questions</p>
                    <button @click="addEditQuestion" class="modal-add-q-btn"><i class="pi pi-plus text-xs mr-1"></i> Add Question</button>
                  </div>
                  <div v-if="editQuestions.length === 0" class="modal-q-empty">
                    <i class="pi pi-question-circle text-2xl mb-2" style="color:#94A3B8;"></i>
                    <p>No questions yet. Click "Add Question" to begin.</p>
                  </div>
                  <div v-else class="flex flex-col gap-3">
                    <div v-for="(q, i) in editQuestions" :key="q.id" class="modal-q-card">
                      <div class="modal-q-top">
                        <span class="modal-q-num">Q{{ i+1 }}</span>
                        <div class="flex items-center gap-1.5 ml-auto">
                          <button @click="moveEditUp(i)" :disabled="i===0" class="modal-q-icon-btn" title="Move up"><i class="pi pi-arrow-up" style="font-size:10px;"></i></button>
                          <button @click="moveEditDown(i)" :disabled="i===editQuestions.length-1" class="modal-q-icon-btn" title="Move down"><i class="pi pi-arrow-down" style="font-size:10px;"></i></button>
                          <button @click="removeEditQuestion(i)" class="modal-q-icon-btn modal-q-del" title="Remove"><i class="pi pi-trash" style="font-size:10px;"></i></button>
                        </div>
                      </div>
                      <div class="modal-field">
                        <label class="modal-label">Question Text</label>
                        <input v-model="q.question_text" type="text" class="modal-input" placeholder="Enter your question" />
                      </div>
                      <div class="modal-field">
                        <label class="modal-label">Type</label>
                        <select v-model="q.question_type" class="modal-input">
                          <option v-for="t in questionTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                        </select>
                      </div>
                      <div v-if="['radio','checkbox','dropdown'].includes(q.question_type)" class="modal-field">
                        <label class="modal-label">Options</label>
                        <div class="flex flex-col gap-2">
                          <div v-for="(opt, oi) in q.options" :key="oi" class="flex gap-2">
                            <input v-model="q.options[oi]" type="text" class="modal-input" style="flex:1" placeholder="Option text" />
                            <button @click="removeEditOption(q,oi)" class="modal-q-icon-btn modal-q-del"><i class="pi pi-times" style="font-size:10px;"></i></button>
                          </div>
                          <button @click="addEditOption(q)" class="modal-add-opt-btn">+ Add Option</button>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <input v-model="q.is_required" type="checkbox" :id="'req-'+i" style="accent-color:#6366F1;" />
                        <label :for="'req-'+i" class="modal-label" style="margin:0;text-transform:none;letter-spacing:0;">Required field</label>
                      </div>
                    </div>
                  </div>
                </div>

              </template>

              <!-- ── PREVIEW VIEW (replaces edit body) ── -->
              <template v-else>
                <div class="modal-section">
                  <div class="flex items-center gap-2 mb-1">
                    <button @click="editPreviewMode = false" class="modal-back-btn">
                      <i class="pi pi-arrow-left" style="font-size:10px;"></i> Back to Edit
                    </button>
                  </div>
                  <div class="modal-preview-box">
                    <h3 class="modal-preview-title">{{ editForm.title || 'Untitled' }}</h3>
                    <p v-if="editForm.description" class="modal-preview-desc">{{ editForm.description }}</p>
                    <div v-if="editQuestions.length === 0" class="modal-q-empty">No questions to preview</div>
                    <div v-else class="flex flex-col gap-5">
                      <div v-for="(q, i) in editQuestions" :key="q.id">
                        <label class="modal-label" style="text-transform:none;letter-spacing:0;font-size:13px;color:#0F172A;">
                          {{ q.question_text }} <span v-if="q.is_required" style="color:#EF4444">*</span>
                        </label>
                        <input v-if="q.question_type==='text'" type="text" disabled class="modal-input" placeholder="Your answer" style="margin-top:6px;" />
                        <textarea v-else-if="q.question_type==='textarea'" disabled rows="2" class="modal-input" style="resize:none;margin-top:6px;" placeholder="Your answer"></textarea>
                        <div v-else-if="q.question_type==='radio'" class="flex flex-col gap-1.5 mt-2">
                          <div v-for="(o,oi) in q.options" :key="oi" class="flex items-center gap-2"><input type="radio" disabled /><span style="font-size:13px;color:#475569;">{{ o }}</span></div>
                        </div>
                        <div v-else-if="q.question_type==='checkbox'" class="flex flex-col gap-1.5 mt-2">
                          <div v-for="(o,oi) in q.options" :key="oi" class="flex items-center gap-2"><input type="checkbox" disabled /><span style="font-size:13px;color:#475569;">{{ o }}</span></div>
                        </div>
                        <select v-else-if="q.question_type==='dropdown'" disabled class="modal-input" style="margin-top:6px;">
                          <option v-for="(o,oi) in q.options" :key="oi">{{ o }}</option>
                        </select>
                        <input v-else-if="q.question_type==='date'" type="date" disabled class="modal-input" style="margin-top:6px;" />
                        <input v-else-if="q.question_type==='number'" type="number" disabled class="modal-input" style="margin-top:6px;" placeholder="Number" />
                        <div v-else-if="q.question_type==='file_upload'" class="modal-file-preview"><i class="pi pi-upload mr-2"></i> File upload</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button @click="closeEditModal" class="modal-cancel-btn">Cancel</button>
              <button @click="saveEdit" :disabled="editSaving" class="modal-save-btn">
                <i v-if="editSaving" class="pi pi-spinner pi-spin mr-1.5"></i>
                {{ editSaving ? 'Saving...' : (editForm.id ? 'Save Changes' : 'Create Questionnaire') }}
              </button>
            </div>

          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<style scoped>
.ql-title {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(135deg, #4F46E5, #7C3AED, #0EA5E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ql-sub { font-size: 13px; color: #94A3B8; margin-top: 2px; }

.ql-create-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  transition: all 0.2s ease;
}
.ql-create-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }

/* Pills */
.ql-pill {
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
.ql-pill:hover { border-color: #6366F1; color: #6366F1; }
.ql-pill-active { background: linear-gradient(135deg,#6366F1,#8B5CF6); color: white !important; border-color: transparent; box-shadow: 0 3px 10px rgba(99,102,241,0.3); }

/* Table wrap */
.ql-table-wrap {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(99,102,241,0.08);
  border: 1.5px solid #E8EAFF;
}

/* Header */
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
  cursor: pointer;
  user-select: none;
  flex: 1;
}
.ql-th:hover { color: white; }

/* Rows */
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
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 0 3px 3px 0;
}

.ql-cell {
  display: flex;
  align-items: center;
  flex: 1;
}

.ql-row-title { font-size: 13px; font-weight: 700; color: #0F172A; }
.ql-row-desc { font-size: 11px; color: #94A3B8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }

/* Badge */
.ql-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}
.ql-badge-active { background: rgba(16,185,129,0.12); color: #059669; }
.ql-badge-inactive { background: rgba(148,163,184,0.15); color: #64748B; }
.ql-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Question chip */
.ql-q-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(99,102,241,0.1);
  color: #6366F1;
  font-size: 12px;
  font-weight: 700;
}

.ql-date { font-size: 12px; color: #64748B; font-weight: 600; }

/* Avatar */
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

/* Action buttons */
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

/* Skeleton */
.ql-skel {
  height: 60px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E8EAFF 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-bottom: 1px solid #F1F5F9;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* Empty */
.ql-empty {
  text-align: center;
  padding: 64px 32px;
  background: white;
  border-radius: 20px;
  border: 1.5px solid #E8EAFF;
}
.ql-empty-icon {
  width: 64px; height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg,#6366F1,#8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.ql-empty-title { font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
.ql-empty-sub { font-size: 13px; color: #94A3B8; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 24px;
}
.modal-box {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(15,23,42,0.2);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #F1F5F9;
  background: linear-gradient(135deg, #F8F9FF, #EEF0FF);
}
.modal-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}
.modal-title { font-size: 16px; font-weight: 800; color: #0F172A; }
.modal-sub { font-size: 12px; color: #94A3B8; margin-top: 2px; }
.modal-close {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1.5px solid #E2E8F0;
  background: white;
  color: #64748B;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
  transition: all 0.15s ease;
}
.modal-close:hover { border-color: #EF4444; color: #EF4444; }

.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-field { display: flex; flex-direction: column; gap: 6px; }
.modal-label { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.modal-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #E2E8F0;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  color: #0F172A;
  background: #F8FAFF;
  outline: none;
  transition: all 0.2s ease;
}
.modal-input:focus { border-color: #6366F1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

.modal-status-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px; font-weight: 700;
  border: 1.5px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white; color: #64748B;
}
.modal-status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.modal-status-active { background: rgba(16,185,129,0.12); color: #059669; border-color: #6EE7B7; }
.modal-status-off { background: rgba(148,163,184,0.15); color: #64748B; border-color: #CBD5E1; }
.modal-status-inactive { background: white; color: #94A3B8; border-color: #E2E8F0; }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #F1F5F9;
  background: #FAFBFF;
}
.modal-cancel-btn {
  padding: 9px 20px; border-radius: 10px;
  border: 1.5px solid #E2E8F0; background: white;
  font-size: 13px; font-weight: 700; color: #64748B;
  cursor: pointer; transition: all 0.15s ease;
}
.modal-cancel-btn:hover { border-color: #94A3B8; }
.modal-save-btn {
  padding: 9px 22px; border-radius: 10px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white; font-size: 13px; font-weight: 700;
  border: none; cursor: pointer;
  display: flex; align-items: center;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  transition: all 0.2s ease;
}
.modal-save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.4); }
.modal-save-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

/* Modal size override — full-height slide-over */
.modal-box {
  max-width: 620px !important;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.modal-body {
  overflow-y: auto;
  flex: 1;
}

/* Sections */
.modal-section {
  padding: 20px 24px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.modal-section-title {
  font-size: 13px;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Preview button in header */
.modal-preview-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid #E2E8F0;
  background: white;
  font-size: 12px;
  font-weight: 700;
  color: #6366F1;
  cursor: pointer;
  transition: all 0.15s ease;
}
.modal-preview-btn:hover { background: #EEF2FF; border-color: #6366F1; }

/* Add question button */
.modal-add-q-btn {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(99,102,241,0.25);
  transition: all 0.15s ease;
}
.modal-add-q-btn:hover { transform: translateY(-1px); }

/* Question card */
.modal-q-card {
  background: #F8F9FF;
  border: 1.5px solid #E8EAFF;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.modal-q-top {
  display: flex;
  align-items: center;
}
.modal-q-num {
  font-size: 11px;
  font-weight: 800;
  color: #6366F1;
  background: rgba(99,102,241,0.12);
  padding: 3px 10px;
  border-radius: 999px;
}
.modal-q-icon-btn {
  width: 26px; height: 26px;
  border-radius: 6px;
  border: 1.5px solid #E2E8F0;
  background: white;
  color: #64748B;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
}
.modal-q-icon-btn:hover { border-color: #6366F1; color: #6366F1; }
.modal-q-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.modal-q-del:hover { border-color: #EF4444 !important; color: #EF4444 !important; }

/* Back to edit button */
.modal-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid #E2E8F0;
  background: white;
  font-size: 12px;
  font-weight: 700;
  color: #6366F1;
  cursor: pointer;
  transition: all 0.15s ease;
}
.modal-back-btn:hover { background: #EEF2FF; border-color: #6366F1; }

/* Add option */
.modal-add-opt-btn {
  font-size: 12px;
  font-weight: 700;
  color: #6366F1;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: opacity 0.15s;
}
.modal-add-opt-btn:hover { opacity: 0.7; }

/* Empty question state */
.modal-q-empty {
  text-align: center;
  padding: 24px;
  color: #94A3B8;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* Preview box */
.modal-preview-box {
  background: #F8F9FF;
  border: 1.5px solid #E8EAFF;
  border-radius: 12px;
  padding: 20px;
}
.modal-preview-title { font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
.modal-preview-desc { font-size: 13px; color: #64748B; margin-bottom: 16px; }
.modal-file-preview {
  margin-top: 6px;
  padding: 12px;
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  font-size: 13px;
  color: #94A3B8;
  display: flex;
  align-items: center;
}

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(0.95) translateY(16px); }

/* Toolbar */
.ql-toolbar {
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
.ql-ctrl-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 5px 10px;
  height: 34px;
}
.ql-ctrl-icon { font-size: 12px; color: #94A3B8; }
.ql-ctrl-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  color: #0F172A;
  width: 150px;
}
.ql-ctrl-input::placeholder { color: #94A3B8; }
.ql-ctrl-select {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.ql-dir-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6366F1;
  padding: 0 2px;
  display: flex;
  align-items: center;
}

/* Group header */
.ql-group-header {
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
.ql-group-count {
  margin-left: 8px;
  background: rgba(99,102,241,0.12);
  color: #6366F1;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
}

/* Progress bar */
.rl-progress-wrap { display: flex; align-items: center; gap: 6px; width: 100%; }
.rl-progress-track { flex: 1; height: 6px; background: #E8EAFF; border-radius: 999px; overflow: hidden; }
.rl-progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
.rl-progress-pct { font-size: 11px; font-weight: 700; white-space: nowrap; }
</style>
