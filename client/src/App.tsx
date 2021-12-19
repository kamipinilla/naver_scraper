import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from './blocks/notFound/NotFound'
import Word from './blocks/word/Word'
import Words from './blocks/words/Words'

const App: React.FC = () => {
  return (
    <div className="flex justify-center bg-white">
      <div className="w-full max-w-screen-md mx-6 my-12">
        <Routes>
          <Route path="words" >
            <Route index element={<Words />} />
            <Route path=":wordId" element={<Word />} />
          </Route>
          <Route path="/" element={<Navigate to="words" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App