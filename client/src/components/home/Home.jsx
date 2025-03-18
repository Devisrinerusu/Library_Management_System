import React from 'react'
import './Home.css'
import { userLoginContext } from '../../contexts/userLoginContext';
function Home() {

  

  return (
    <div className='homepage'>
       
       <div className="container">
        <div className="home">
        <div className="img">
          <img src="https://static.vecteezy.com/system/resources/previews/029/919/720/non_2x/library-illustration-of-book-shelves-with-interior-wooden-furniture-for-reading-education-and-knowledge-in-flat-cartoon-background-design-vector.jpg" alt="" />
        </div>
        <div className='quote'>
          <h1 className='text-end'>Online LIBRARY</h1>
          <p className='text-end'>"Effortlessly manage book borrowing, tracking, and availability with our smart library system. Simplifying access to knowledge for students and administrators alike."</p>
        </div>
        </div>

        <div className="homecarts">
          <div className="cart c1 ">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/researcher-working-on-computer-illustration-download-in-svg-png-gif-file-formats--biological-biotechnology-design-desk-bacteria-virus-research-pack-science-technology-illustrations-2764204.png?f=webp" alt="" />
            <h4>
              Computer Science and Information Technology
            </h4>
          </div>

          <div className="cart c1">
            <img src="https://img.freepik.com/free-vector/tiny-scientists-developing-ai-using-machine-learning-brain-computing-data-flat-vector-illustration-artificial-intelligence-technology-science-concept-banner-website-design-landing-web-page_74855-22578.jpg" alt="" />
            <h4>AIDS & ML</h4>
          </div>

          <div className="cart c1">
            <img src="https://static.vecteezy.com/system/resources/previews/020/929/004/non_2x/electronic-manufacturing-components-circuit-engineering-design-coordinate-symbols-concept-isometric-illustration-isometric-isolated-vector.jpg" alt="" />
            <h4>Electronics AND Commucation Engineering</h4>
          </div>
          <div className="cart c2">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/electrical-engineer-illustration-download-in-svg-png-gif-file-formats--electrician-plug-wires-socket-engineering-careers-pack-people-illustrations-5673264.png" alt="" />
            <h4>Electical AND Electronics Engineering</h4>
          </div>

          <div className="cart c2">
            <img src="https://img.freepik.com/premium-vector/factory-worker-repairing-machine-illustration-concept-white-background_701961-4194.jpg" alt="" />
            <h4>Mechanical Engineering</h4>
          </div>
          <div className="cart c2">
            <img src="https://img.freepik.com/premium-vector/construction-engineer-cartoon_18591-36881.jpg" alt="" />
            <h4>Civil Engineering</h4>
          </div>
        </div>
       </div>

    </div>
  )
}

export default Home