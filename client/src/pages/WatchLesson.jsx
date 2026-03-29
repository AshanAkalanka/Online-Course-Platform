import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import Alert from '../components/Alert';
import { getVideoSource } from '../utils/video';

const WatchLesson = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [progress, setProgress] = useState({
        completedLessonIds: [],
        percentage: 0
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const videoSource = selectedLesson ? getVideoSource(selectedLesson.video_url) : { type: 'invalid', src: null };

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            }
        };

        const loadProgress = async () => {
            try {
                const res = await api.get(`/progress/course/${id}`);
                setProgress(res.data);
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        void loadCourse();
        void loadProgress();
    }, [id]);

    useEffect(() => {
        if (!course?.lessons?.length) {
            return;
        }

        const currentStillExists = course.lessons.some((lesson) => lesson.id === selectedLesson?.id);
        if (currentStillExists) {
            return;
        }

        const firstIncompleteLesson = course.lessons.find(
            (lesson) => !progress.completedLessonIds.includes(lesson.id)
        );

        setSelectedLesson(firstIncompleteLesson || course.lessons[0]);
    }, [course, progress.completedLessonIds, selectedLesson]);

    const selectedLessonIndex = course?.lessons?.findIndex((lesson) => lesson.id === selectedLesson?.id) ?? -1;
    const previousLesson = selectedLessonIndex > 0 ? course?.lessons[selectedLessonIndex - 1] : null;
    const nextLesson = selectedLessonIndex >= 0 && selectedLessonIndex < (course?.lessons?.length ?? 0) - 1
        ? course?.lessons[selectedLessonIndex + 1]
        : null;

    const markComplete = async (lessonId) => {
        try {
            await api.post('/progress/complete', {
                course_id: id,
                lesson_id: lessonId
            });
            setMessage('Lesson marked as completed');
            const res = await api.get(`/progress/course/${id}`);
            setProgress(res.data);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    if (loading && !course) return <div className="page"><div className="loading-panel"></div></div>;
    if (!course) return <div className="page"><div className="empty-state">Unable to load lessons.</div></div>;

    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Watch lessons</p>
                <h2>{course.title}</h2>
                <p className="page-subtitle">Choose a lesson, watch the content, and mark progress as you complete each step.</p>
            </div>

            <Alert type="success" message={message} />
            <Alert type="error" message={errorMessage} />

            <div className="progress-section">
                <p><strong>Course Progress:</strong> {progress.percentage}%</p>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress.percentage}%` }}></div>
                </div>
            </div>

            <div className="watch-page-layout">
                <div className="lesson-sidebar fade-up">
                    <h3>Lessons</h3>
                    {course.lessons?.map((lesson) => {
                        const completed = progress.completedLessonIds.includes(lesson.id);

                        return (
                            <div
                                key={lesson.id}
                                className={`lesson-item ${selectedLesson?.id === lesson.id ? 'active-lesson' : ''}`}
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                <p>{lesson.lesson_order}. {lesson.title}</p>
                                <div className="lesson-item-footer">
                                    <span>{completed ? 'Completed' : 'Not completed'}</span>
                                    <span>{completed ? 'Ready for review' : 'Next action'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lesson-player fade-up">
                    {selectedLesson ? (
                        <>
                            {videoSource.type === 'embed' && videoSource.src ? (
                                <iframe
                                    width="100%"
                                    height="420"
                                    src={videoSource.src}
                                    title={selectedLesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            ) : null}

                            {videoSource.type === 'video' && videoSource.src ? (
                                <video className="lesson-video" controls preload="metadata">
                                    <source src={videoSource.src} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : null}

                            {videoSource.type === 'link' && videoSource.src ? (
                                <div className="empty-state">
                                    <p style={{ marginBottom: '12px' }}>
                                        This video host does not support direct inline playback here.
                                    </p>
                                    <a className="btn-primary" href={videoSource.src} target="_blank" rel="noreferrer">
                                        Open Video
                                    </a>
                                </div>
                            ) : (
                                videoSource.type === 'invalid' && (
                                    <div className="empty-state">
                                        This lesson does not have a valid video URL yet.
                                    </div>
                                )
                            )}

                            <h3>{selectedLesson.title}</h3>
                            <p>{selectedLesson.content}</p>
                            <div className="lesson-player-actions">
                                <button
                                    className="btn-ghost"
                                    onClick={() => previousLesson && setSelectedLesson(previousLesson)}
                                    disabled={!previousLesson}
                                >
                                    Previous Lesson
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => markComplete(selectedLesson.id)}
                                >
                                    Mark as Complete
                                </button>
                                <button
                                    className="btn-ghost"
                                    onClick={() => nextLesson && setSelectedLesson(nextLesson)}
                                    disabled={!nextLesson}
                                >
                                    Next Lesson
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No lesson selected</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WatchLesson;
