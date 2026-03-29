import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { getCourseImage } from '../utils/media';

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCoursesProgress = async () => {
            try {
                const res = await api.get('/progress/my-courses');
                setCourses(res.data);
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };
        void fetchMyCoursesProgress();
    }, []);

    return (
        <div className="page">
            <h2 className="section-title">My Learning</h2>
            <p className="page-subtitle" style={{ marginBottom: '22px' }}>
                Pick up where you left off and keep an eye on your completion progress across enrolled courses.
            </p>

            <Alert type="error" message={errorMessage} />

            <div className="course-grid">
                {loading ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="loading-card"></div>
                )) : courses.length ? courses.map((course, index) => {
                    const imageUrl = getCourseImage(course, index);

                    return (
                        <div key={course.id} className="course-card fade-up">
                            <div className="course-card-media">
                                <img src={imageUrl} alt={course.title} />
                            </div>
                            <div className="course-card-body">
                                <div className="course-card-topline">
                                    <span className="badge">{course.category || 'Enrolled course'}</span>
                                    <span className="meta-pill alt">{course.percentage}% complete</span>
                                </div>
                                <h3>{course.title}</h3>

                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${course.percentage}%` }}
                                    ></div>
                                </div>

                                <p>{course.completedLessons} / {course.totalLessons} lessons completed</p>
                                <p><strong>{course.percentage}% complete</strong></p>

                                <Link to={`/watch/${course.id}`} className="btn-primary">Continue</Link>
                            </div>
                        </div>
                    );
                }) : <div className="empty-state">You have not enrolled in any courses yet.</div>}
            </div>
        </div>
    );
};

export default MyLearning;
