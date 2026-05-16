import { useState } from 'react'
import { SquarePen as PenSquare, User, Calendar, Trash2, Search, Inbox, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

const initialNotices = [
  {
    id: '1',
    title: '2026년 상반기 워크숍 일정 안내',
    content: '안녕하세요. 2026년 상반기 팀 워크숍 일정을 안내드립니다. 일정은 6월 14일(토)~15일(일)이며, 장소는 강원도 속초입니다. 참가 신청은 5월 말까지 완료해 주시기 바랍니다.',
    author: '김지현',
    createdAt: '2026-05-10T09:00:00Z',
    isPinned: true,
    category: '공지',
  },
  {
    id: '2',
    title: '5월 프로젝트 마일스톤 리뷰 회의',
    content: '이번 주 금요일 오후 3시에 5월 마일스톤 리뷰 회의가 진행됩니다. 각 팀별 진행 현황 자료를 회의 전날까지 공유 폴더에 업로드해 주세요. 미완료 항목이 있는 경우 사전에 팀장에게 보고 바랍니다.',
    author: '박성훈',
    createdAt: '2026-05-12T14:30:00Z',
    isPinned: true,
    category: '업무',
  },
  {
    id: '3',
    title: '사무실 에어컨 점검 일정 공지',
    content: '5월 20일(수) 오전 10시~12시 사이에 사무실 에어컨 정기 점검이 진행됩니다. 해당 시간 중 소음이 발생할 수 있으니 양해 부탁드립니다. 점검 완료 후 정상 가동될 예정입니다.',
    author: '이수정',
    createdAt: '2026-05-13T11:00:00Z',
    isPinned: false,
    category: '공지',
  },
  {
    id: '4',
    title: '신규 업무 협업 툴 도입 안내',
    content: '6월부터 팀 협업 툴을 Notion에서 Linear로 전환합니다. 전환 교육은 5월 28일에 진행될 예정이며, 참석은 필수입니다. 계정 초대 메일을 확인하시고 사전 가입을 완료해 주세요.',
    author: '최민준',
    createdAt: '2026-05-14T16:00:00Z',
    isPinned: false,
    category: '업무',
  },
  {
    id: '5',
    title: '팀 점심 맛집 추천 받습니다',
    content: '다음 주 팀 점심 회식 장소를 정하고 있습니다. 사무실 주변 맛집 추천해 주세요! 한식, 일식, 양식 모두 환영합니다. 추천 장소는 팀 채팅방에 공유 부탁드립니다.',
    author: '정다은',
    createdAt: '2026-05-15T10:00:00Z',
    isPinned: false,
    category: '기타',
  },
]

const CATEGORIES = ['전체', '공지', '업무', '기타']

const categoryVariant = { '공지': 'blue', '업무': 'green', '기타': 'gray' }

function formatDate(iso) {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

const FORM_CATEGORIES = ['공지', '업무', '기타']

function NoticeFormDialog({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('공지')
  const [isPinned, setIsPinned] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) return
    onSubmit({ title: title.trim(), content: content.trim(), author: author.trim(), category, isPinned })
    setTitle('')
    setContent('')
    setAuthor('')
    setCategory('공지')
    setIsPinned(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[66vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">새 공지 작성</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
              className="h-10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">작성자 <span className="text-red-500">*</span></label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="이름을 입력하세요"
                className="h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">카테고리</label>
              <div className="flex gap-2">
                {FORM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      category === cat
                        ? cat === '공지'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : cat === '업무'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">본문 <span className="text-red-500">*</span></label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지 내용을 작성하세요..."
              rows={10}
              required
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="pinned"
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="pinned" className="text-sm font-medium text-gray-700 cursor-pointer">
              상단 고정
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">
              게시하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function NoticeListPage({ notices: propNotices, onDelete: propOnDelete, onNavigate }) {
  const [notices, setNotices] = useState(initialNotices)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [formOpen, setFormOpen] = useState(false)

  const activeNotices = propNotices ?? notices

  function handleDelete(id) {
    if (propOnDelete) {
      propOnDelete(id)
    } else {
      setNotices((prev) => prev.filter((n) => n.id !== id))
    }
  }

  function handleAddNotice(data) {
    const newNotice = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
    }
    setNotices((prev) => [newNotice, ...prev])
  }

  const filtered = activeNotices
    .filter((n) => selectedCategory === '전체' || n.category === selectedCategory)
    .filter((n) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) return 0
      return a.isPinned ? -1 : 1
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">팀 공지사항</h1>
            <p className="text-sm text-gray-500 mt-1">팀의 중요한 소식을 확인하세요</p>
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-2 shadow-sm">
            <PenSquare className="h-4 w-4" />
            새 공지 작성
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 또는 작성자 검색..."
              className="pl-9 h-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
            <Inbox className="h-12 w-12 opacity-40" />
            <p className="text-base font-medium">검색 결과가 없습니다</p>
            <p className="text-sm">다른 검색어나 카테고리를 시도해 보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notice) => (
              <Card
                key={notice.id}
                className={`border transition-all duration-200 hover:shadow-md ${
                  notice.isPinned
                    ? 'bg-amber-50 border-amber-200 hover:shadow-amber-100'
                    : 'bg-white border-gray-100'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {notice.isPinned && (
                          <Badge variant="amber" className="text-xs gap-1">
                            <span>📌</span> 고정
                          </Badge>
                        )}
                        <Badge variant={categoryVariant[notice.category] ?? 'gray'} className="text-xs">
                          {notice.category}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-base font-semibold text-gray-900 cursor-pointer hover:text-primary transition-colors leading-snug mb-1.5 truncate"
                        onClick={() => onNavigate?.('detail', notice.id)}
                      >
                        {notice.title}
                      </h2>

                      {/* Preview */}
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {notice.content.length > 80
                          ? notice.content.slice(0, 80) + '...'
                          : notice.content}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {notice.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(notice.id)}
                      aria-label="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <NoticeFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAddNotice}
      />
    </div>
  )
}
