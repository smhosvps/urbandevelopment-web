import { useState } from 'react';
import BookList from '../../../components/bible/BookList';
import ChapterList from '../../../components/bible/ChapterList';
import VerseList from '../../../components/bible/VerseList';
import BibleManager from '../../../components/bible/BibleManager';

type Props = {}

export default function ManageBible({}: Props) {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [activeTab, setActiveTab] = useState('1');

  return (
      <div className="mx-auto p-4 md:p-0">
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-semibold ${
                activeTab === '1'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('1')}
            >
              Read Bible
            </button>
            <button
              className={`py-2 px-4 font-semibold ${
                activeTab === '2'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('2')}
            >
              Manage Content
            </button>
          </div> 
        </div>
        {activeTab === '1' && (
          <div className="bible-container grid grid-cols-1 md:grid-cols-3 gap-4">
            <BookList onSelectBook={setSelectedBook} />
            {selectedBook && ( 
              <ChapterList
                bookName={selectedBook}
                onSelectChapter={setSelectedChapter}
              />
            )}
            {selectedBook && selectedChapter && (
              <VerseList bookName={selectedBook} chapterNumber={selectedChapter} />
            )}
          </div>
        )}
        {activeTab === '2' && <BibleManager />}
      </div>
  );
}

