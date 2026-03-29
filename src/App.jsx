import Image1 from './path/to/image1.png';
import Image2 from './path/to/image2.png';
import Image3 from './path/to/image3.png';

// Use the image variables instead of string paths
function App() {
  return (
    <div>
      <img src={Image1} alt='Image 1' />
      <img src={Image2} alt='Image 2' />
      <img src={Image3} alt='Image 3' />
    </div>
  );
}

export default App;