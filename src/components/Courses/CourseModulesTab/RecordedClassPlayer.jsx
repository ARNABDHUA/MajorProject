import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, BookOpen, Filter, Loader } from 'lucide-react';

const RecordedClassPlayer=()=> {
  // State for filter options and selections
  const [semesters, setSemesters] = useState([]);
  const [paperCodes, setPaperCodes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [videos, setVideos] = useState([]);

  // State for selected filters
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedPaperCode, setSelectedPaperCode] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial data (semesters and paper codes)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch semesters
        const semestersResponse = await fetch('/api/semesters');
        const semestersData = await semestersResponse.json();
        setSemesters(semestersData);
        
        // Fetch paper codes
        const paperCodesResponse = await fetch('/api/paperCodes');
        const paperCodesData = await paperCodesResponse.json();
        setPaperCodes(paperCodesData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch topics when semester or paper code changes
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSemester && !selectedPaperCode) {
        setTopics([]);
        setFilteredTopics([]);
        return;
      }
      
      setLoading(true);
      try {
        let url = '/api/topics?';
        if (selectedSemester) url += `semester=${selectedSemester}&`;
        if (selectedPaperCode) url += `paperCode=${selectedPaperCode}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setTopics(data);
        setFilteredTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [selectedSemester, selectedPaperCode]);

  // Fetch video when topic changes
  useEffect(() => {
    const fetchVideo = async () => {
      if (!selectedTopic) {
        setSelectedVideo(null);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/videos?topicId=${selectedTopic}`);
        const data = await response.json();
        setSelectedVideo(data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error('Error fetching video:', error);
        setSelectedVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [selectedTopic]);

  // Handle filter changes
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedTopic('');
  };

  const handlePaperCodeChange = (e) => {
    setSelectedPaperCode(e.target.value);
    setSelectedTopic('');
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Recorded Class Library</h1>
      
      {initialLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Filter Recordings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Semester Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <div className="relative">
                  <select 
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md appearance-none"
                  >
                    <option value="">All Semesters</option>
                    {semesters.map(semester => (
                      <option key={semester} value={semester}>Semester {semester}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Paper Code Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Paper Code</label>
                <div className="relative">
                  <select 
                    value={selectedPaperCode}
                    onChange={handlePaperCodeChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md appearance-none"
                  >
                    <option value="">Select Course</option>
                    {paperCodes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Topic Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <div className="relative">
                  <select 
                    value={selectedTopic}
                    onChange={handleTopicChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md appearance-none"
                    disabled={filteredTopics.length === 0}
                  >
                    <option value="">Select Topic</option>
                    {filteredTopics.map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}
          
          {/* Video Player Section */}
          {!loading && selectedVideo && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full bg-black relative">
                {/* Video player */}
                <video 
                  className="w-full h-full object-contain" 
                  controls
                  poster={selectedVideo.thumbnailUrl || '/api/placeholder/640/360'}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{selectedVideo.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1 text-indigo-600" />
                    <span>{selectedVideo.topicName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-indigo-600" />
                    <span>Uploaded on {formatDate(selectedVideo.uploadDate)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                    Download Notes
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition">
                    Related Materials
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty state when no course is selected */}
          {!loading && !selectedPaperCode && !selectedVideo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Select a Course to View Recordings</h3>
              <p className="text-gray-500 max-w-md mx-auto">Choose a semester and course from the filters above to browse available lecture recordings.</p>
            </div>
          )}
          
          {/* Empty search results */}
          {!loading && selectedPaperCode && filteredTopics.length === 0 && !selectedVideo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <Filter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Recordings Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">There are no recorded lectures available for the selected filters. Try changing your selection.</p>
            </div>
          )}
          
          {/* Topic list when course is selected but no specific video yet */}
          {!loading && !selectedVideo && filteredTopics.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Available Recordings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTopics.map(topic => (
                  <div 
                    key={topic.id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                    onClick={() => setSelectedTopic(topic.id.toString())}
                  >
                    <div className="h-40 bg-gray-200 relative">
                      <img 
                        src={topic.thumbnailUrl || '/api/placeholder/640/360'} 
                        alt={topic.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <div className="w-16 h-16 rounded-full bg-indigo-600 bg-opacity-80 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{topic.name}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(topic.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecordedClassPlayer;