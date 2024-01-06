import './workCard.css';

interface WorkCardProps {
  work: {
    title: string;
    description: string;
    image: string;
    date: string;
  };
}

const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const { title, description, image, date } = work;

  return (
    <div className="work-card">
      <div className="work-card-image">
        <img src={image} alt={title} />
      </div>
      <div className="work-card-content">
        <h3 className="work-card-title">{title}</h3>
        <strong className="work-card-date">{date}</strong>
        <p className="work-card-description">{description}</p>
      </div>
    </div>
  );
}

export default WorkCard;
