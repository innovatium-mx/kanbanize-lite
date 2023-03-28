import { Inter } from 'next/font/google'
import { BrowserRouter } from 'react-router-dom';
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>HOME</h1>
    </div>
  )
}
