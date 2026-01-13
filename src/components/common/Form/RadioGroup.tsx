import styles from './RadioGroup.module.scss';

interface Option {
    label: string;
    value: string;
}

interface RadioGroupProps {
    name: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
}

const RadioGroup = ({ name, value, options, onChange }: RadioGroupProps) => {
    return (
        <div className={styles.container}>
            {options.map((opt) => (
                <label key={opt.value} className={value === opt.value ? styles.active : ''}>
                    <input 
                        type="radio" 
                        name={name} 
                        value={opt.value} 
                        checked={value === opt.value} 
                        onChange={() => onChange(opt.value)} 
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
};

export default RadioGroup;