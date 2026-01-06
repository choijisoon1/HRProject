import styles from './PageHeader.module.scss';

interface PageHeaderProps {
    title: string;       
    description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
};

export default PageHeader;