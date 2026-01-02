'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Calendar,
  CheckSquare,
  ChevronLeft,
  GripVertical,
  MessageSquare,
  Plus,
  Save,
  Send,
  Settings2,
  Type,
  Upload,
  X,
} from 'lucide-react';

type QuestionType = 'multiple_choice' | 'short_answer' | 'descriptive' | 'file_upload';

interface QuestionBlock {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[]; // For multiple choice
  required: boolean;
}

export default function AssignmentCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState<QuestionBlock[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addBlock = (type: QuestionType) => {
    const newBlock: QuestionBlock = {
      id: Math.random().toString(36).substring(7),
      type,
      title: '',
      required: true,
      options: type === 'multiple_choice' ? [''] : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<QuestionBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      {/* Main Editor Area */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto pb-40">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 flex w-full max-w-5xl items-center justify-between bg-[#FDFDFD]/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-400">내 숙제 / 템플릿 생성</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
              <Save className="h-4 w-4" /> 임시 저장
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-black">
              <Send className="h-4 w-4" /> 숙제 배포
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`rounded-lg p-2 transition-colors ${isSidebarOpen ? 'bg-gray-100 text-[#1A1A1A]' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Settings2 className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Editor Body */}
        <main className="animate-in fade-in slide-in-from-bottom-4 mt-16 w-full max-w-3xl px-6 duration-500">
          {/* Title Input */}
          <textarea
            placeholder="숙제 제목을 입력하세요"
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-6 w-full resize-none border-none bg-transparent text-4xl font-extrabold outline-none placeholder:text-gray-200 lg:text-5xl"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          {/* Description Input */}
          <textarea
            placeholder="이 숙제의 목적이나 지시사항을 자유롭게 적어주세요..."
            rows={1}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-12 w-full resize-none border-none bg-transparent text-lg leading-relaxed text-gray-600 outline-none placeholder:text-gray-300"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          {/* Blocks Container */}
          <div className="space-y-12">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-300"
              >
                <div className="absolute top-1/2 -left-10 -translate-y-1/2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-5 w-5 text-gray-300" />
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1">
                    {block.type === 'multiple_choice' && (
                      <CheckSquare className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    {block.type === 'short_answer' && (
                      <Type className="h-3.5 w-3.5 text-green-500" />
                    )}
                    {block.type === 'descriptive' && (
                      <MessageSquare className="h-3.5 w-3.5 text-orange-500" />
                    )}
                    {block.type === 'file_upload' && (
                      <Upload className="h-3.5 w-3.5 text-purple-500" />
                    )}
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                      {block.type.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1 text-gray-300 transition-colors hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="질문 내용을 입력하세요"
                  value={block.title}
                  onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                  className="w-full border-none bg-transparent text-xl font-semibold outline-none placeholder:text-gray-200"
                />

                {/* Additional specific UI for block types */}
                {block.type === 'multiple_choice' && (
                  <div className="mt-4 space-y-2">
                    {block.options?.map((opt, i) => (
                      <div key={i} className="group/opt flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
                        <input
                          type="text"
                          placeholder={`옵션 ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(block.options || [])];
                            newOpts[i] = e.target.value;
                            updateBlock(block.id, { options: newOpts });
                          }}
                          className="flex-1 border-none bg-transparent text-gray-600 outline-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        updateBlock(block.id, { options: [...(block.options || []), ''] });
                      }}
                      className="ml-8 py-2 text-sm font-medium text-blue-500 hover:underline"
                    >
                      + 옵션 추가
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Block Dropzone */}
          <div className="mt-12 flex flex-col items-center">
            <div className="relative mb-8 h-px w-full bg-gray-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FDFDFD] px-4 text-xs font-bold tracking-widest text-gray-300 uppercase">
                Add Section
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { type: 'multiple_choice' as QuestionType, icon: CheckSquare, label: '객관식' },
                { type: 'short_answer' as QuestionType, icon: Type, label: '주관식' },
                { type: 'descriptive' as QuestionType, icon: MessageSquare, label: '서술형' },
                { type: 'file_upload' as QuestionType, icon: Upload, label: '파일 업로드' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item.type)}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:text-blue-500 hover:shadow-md"
                >
                  <item.icon className="mb-2 h-6 w-6 text-gray-400 transition-colors group-hover:text-blue-500" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Right Sidebar Settings */}
      {isSidebarOpen && (
        <aside className="animate-in slide-in-from-right-4 sticky top-0 h-screen w-80 overflow-y-auto border-l border-gray-100 bg-white p-8 duration-300">
          <h2 className="mb-8 text-lg font-bold">숙제 설정</h2>

          <div className="space-y-8">
            <section>
              <label className="mb-3 block text-xs font-bold tracking-widest text-gray-400 uppercase">
                배포 대상
              </label>
              <div className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                <span className="text-sm font-medium">대상 선택</span>
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </section>

            <section>
              <label className="mb-3 block text-xs font-bold tracking-widest text-gray-400 uppercase">
                제출 기한
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">기한 설정 안함</span>
                </div>
              </div>
            </section>

            <section>
              <label className="mb-3 block text-xs font-bold tracking-widest text-gray-400 uppercase">
                숙제 관리
              </label>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <span className="text-sm font-medium">템플릿으로 저장</span>
                <div className="relative h-5 w-10 cursor-pointer rounded-full bg-gray-200">
                  <div className="absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-all" />
                </div>
              </div>
            </section>
          </div>
        </aside>
      )}
    </div>
  );
}
