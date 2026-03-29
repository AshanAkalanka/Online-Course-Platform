import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import Alert from '../components/Alert';
import { useAuth } from '../context/useAuth';
import { getCourseImage } from '../utils/media';

const CourseDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadPageData = async () => {
            try {
                const courseRequest = api.get(`/courses/${id}`);
                const enrollmentRequest = user ? api.get('/enrollments/my-courses') : Promise.resolve({ data: [] });
                const [courseResponse, enrollmentResponse] = await Promise.all([courseRequest, enrollmentRequest]);

                setCourse(courseResponse.data);
                setIsEnrolled(enrollmentResponse.data.some((enrolledCourse) => Number(enrolledCourse.id) === Number(id)));
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            }
        };

        void loadPageData();
    }, [id, user]);

    const handleEnroll = async () => {
        try {
            setIsSubmitting(true);
            await api.post('/enrollments', { course_id: id });
            setMessage('You have been enrolled successfully.');
            setErrorMessage('');
            setIsEnrolled(true);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!course && !errorMessage) return <div className="page"><div className="empty-state">Loading course...</div></div>;

    return (
        <div className="page">
            <Alert type="success" message={message} />
            <Alert type="error" message={errorMessage} />

            {course ? (
                <div className="details-layout">
                    <div className="details-hero fade-up">
                        <img src={getCourseImage(course)} alt={course.title} />
                    </div>

                    <div className="details-card fade-up delay-1">
                        <div className="details-hero-copy">
                            <div className="page-header">
                                <p className="eyebrow">Course details</p>
                                <h2 className="details-title">{course.title}</h2>
                                <p className="page-subtitle">{course.description}</p>
                            </div>

                            <div className="details-summary-grid">
                                <div className="details-summary-card">
                                    <strong>{course.category || 'General'}</strong>
                                    <span>Category</span>
                                </div>
                                <div className="details-summary-card">
                                    <strong>{course.level || 'All levels'}</strong>
                                    <span>Level</span>
                                </div>
                                <div className="details-summary-card">
                                    <strong>{course.lessons?.length || 0}</strong>
                                    <span>Lessons</span>
                                </div>
                            </div>
                        </div>

                        <div className="details-meta">
                            <span className="meta-pill">{course.category || 'General'}</span>
                            <span className="meta-pill alt">{course.level || 'All levels'}</span>
                            <span>{course.lessons?.length || 0} lessons included</span>
                        </div>

                        {user ? (
                            <div className="course-card-actions">
                                {isEnrolled ? (
                                    <>
                                        <span className="meta-pill">Already enrolled</span>
                                        <button className="btn-primary" onClick={() => navigate('/my-learning')}>
                                            Go to My Learning
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn-primary" onClick={handleEnroll} disabled={isSubmitting}>
                                        {isSubmitting ? 'Enrolling...' : 'Enroll Now'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="course-card-actions">
                                <p className="page-subtitle">Create an account or sign in to enroll and track progress.</p>
                                <Link to="/login" className="btn-primary">Sign in to enroll</Link>
                            </div>
                        )}

                        <div>
                            <h3>Course lessons</h3>
                            <div className="lesson-list">
                                {course.lessons?.length ? (
                                    course.lessons.map((lesson) => (
                                        <div key={lesson.id} className="lesson-row">
                                            <div className="lesson-row-head">
                                                <strong>{lesson.lesson_order}. {lesson.title}</strong>
                                                <span className="meta-pill alt">Lesson {lesson.lesson_order}</span>
                                            </div>
                                            <p>{lesson.content || 'Lesson notes and supporting content will appear here.'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">This course does not have lessons yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-state">Unable to load this course.</div>
            )}
        </div>
    );
};

export default CourseDetails;
