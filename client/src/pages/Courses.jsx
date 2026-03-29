import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/axios';
import CourseCard from '../components/CourseCard';
import Alert from '../components/Alert';

const initialFilters = {
    search: '',
    category: '',
    level: ''
};

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const query = new URLSearchParams(initialFilters).toString();
                const [coursesRes, categoriesRes] = await Promise.all([
                    api.get(`/courses?${query}`),
                    api.get('/courses/categories')
                ]);
                setCourses(coursesRes.data);
                setAllCourses(coursesRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        void loadCourses();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        const loadCourses = async () => {
            try {
                const query = new URLSearchParams(filters).toString();
                const res = await api.get(`/courses?${query}`);
                setCourses(res.data);
                setErrorMessage('');
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        void loadCourses();
    };

    const featuredCourses = courses.slice(0, 3);

    return (
        <div className="page">
            <div className="page-header fade-up">
                <p className="eyebrow">Course catalog</p>
                <h2>Discover the right course for your next skill.</h2>
                <p className="page-subtitle">
                    Explore subjects, compare levels, and move from browsing to enrollment with a clearer catalog experience.
                </p>
            </div>

            <Alert type="error" message={errorMessage} />

            <div className="catalog-overview fade-up">
                <div className="catalog-overview-card">
                    <strong>{allCourses.length}</strong>
                    <span>Courses available</span>
                </div>
                <div className="catalog-overview-card">
                    <strong>{categories.length}</strong>
                    <span>Categories</span>
                </div>
                <div className="catalog-overview-card">
                    <strong>Beginner to Advanced</strong>
                    <span>Flexible learning levels</span>
                </div>
            </div>

            <form className="filter-bar fade-up" onSubmit={handleSearch}>
                <div className="filter-grid">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by course title or description"
                        value={filters.search}
                        onChange={handleChange}
                    />

                    <select name="category" value={filters.category} onChange={handleChange}>
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select name="level" value={filters.level} onChange={handleChange}>
                        <option value="">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div className="course-card-actions">
                    <button className="btn-primary" type="submit">Search</button>
                    <button
                        className="btn-ghost"
                        type="button"
                        onClick={() => {
                            setFilters(initialFilters);
                            setCourses(allCourses);
                            setErrorMessage('');
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>

            {featuredCourses.length > 0 && (
                <div className="catalog-featured fade-up">
                    <div className="catalog-featured-header">
                        <h3>Featured right now</h3>
                        <p>Start with some of the most visible courses in the catalog.</p>
                    </div>
                    <div className="course-grid compact-grid">
                        {featuredCourses.map((course, index) => (
                            <CourseCard key={`featured-${course.id}`} course={course} index={index} />
                        ))}
                    </div>
                </div>
            )}

            <div className="catalog-featured-header">
                <h3>All courses</h3>
                <p>{loading ? 'Loading courses...' : `${courses.length} result${courses.length === 1 ? '' : 's'}`}</p>
            </div>

            <div className="course-grid">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="loading-card"></div>
                    ))
                ) : courses.length > 0 ? (
                    courses.map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))
                ) : (
                    <div className="empty-state">No courses matched your current search.</div>
                )}
            </div>
        </div>
    );
};

export default Courses;
