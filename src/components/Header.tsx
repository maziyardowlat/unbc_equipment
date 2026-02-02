import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoAndTitle}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoPlaceholder}>UNBC</div>
          </Link>
          <div className={styles.titleWrapper}>
            <h1 className={styles.mainTitle}>University of Northern British Columbia</h1>
            <h2 className={styles.subTitle}>Inventory Management Form</h2>
          </div>
        </div>
      </div>
    </header>
  );
}
