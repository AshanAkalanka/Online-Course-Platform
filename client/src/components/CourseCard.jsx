import { Link } from 'react-router-dom';
import { getCourseImage } from '../utils/media';

const CourseCard = ({ course, index = 0 }) => {
    const imageUrl = getCourseImage(course, index);

    return (
        <div className="course-card fade-up">
            <div className="course-card-media">
                <img src={imageUrl} alt={course.title} />
            </div>
            <div className="course-card-body">
                <div className="course-card-topline">
                    <span className="badge">{course.category || 'General'}</span>
                    <span className="meta-pill alt">{course.level || 'All levels'}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description?.slice(0, 110) || 'Explore practical lessons and guided projects.'}...</p>
                <div className="course-card-actions">
                    <Link to={`/courses/${course.id}`} className="btn-primary">View Course</Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
