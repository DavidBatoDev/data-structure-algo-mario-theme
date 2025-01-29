import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import TicTacToe from './pages/TicTacToe';
import Stack from './pages/Stack';
import Queue from './pages/Queue';
import BinaryTreeTraversal from './pages/BinaryTreeTraversal';
import BSTWithTraversals from './pages/BSTWithTraversal';
import TowersOfHanoi from './pages/TowersOfHanoi';
import Selection from './pages/Selection';
import Sorting from './pages/Sorting';

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* <Route path='/selection' element={<TicTacToe />} /> */}
          <Route path="/case1" element={<TicTacToe />} />
          <Route path="/case2" element={<Stack />} />
          <Route path="/case3" element={<Queue />} />
          <Route path='/case4' element={<BinaryTreeTraversal />} />
          <Route path='/case5' element={<BSTWithTraversals />} />
          <Route path="/case6" element={<TowersOfHanoi />} />
          <Route path="/case7" element={<Sorting />} />
        </Routes>
    </Router>
  );
}

export default App;
