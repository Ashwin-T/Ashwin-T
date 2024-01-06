import './skillCard.css'

interface Skill {
  name: string;
  logo: string;
}

interface SkillCardProps {
  skills: Skill[];
}

const SkillCard: React.FC<SkillCardProps> = ({ skills }) => (
  <div className='skill-card'>
    {skills.map((skill) => (
      <div>
        <img key = {skill.name} src={skill.logo} alt={skill.name} />
        <p>{skill.name}</p>
      </div>
    ))}
  </div>
);

export default SkillCard;