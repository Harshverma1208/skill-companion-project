import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  fetchMarketStats,
  fetchSalaryTrends,
  fetchIndustryDistribution,
  fetchSkillDemand,
  fetchTrendingTech,
  fetchJobDetails,
} from "../services/trendService";

// Stats Card Component
const StatCard = ({ title, value, change, period }) => (
  <Card
    sx={{
      height: "100%",
      boxShadow: "none",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      position: "relative",
      overflow: "visible",
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: "30%",
        height: "100%",
        backgroundColor: "#3b82f6",
        opacity: 0.1,
        borderTopRightRadius: "12px",
        borderBottomRightRadius: "12px",
      },
    }}
  >
    <CardContent>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
        {value}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "#10b981", display: "flex", alignItems: "center" }}
        >
          <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {change}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {period}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Skill Gap Card Component
const SkillGapCard = ({ title, description, skills, recommendations }) => (
  <Card
    sx={{
      height: "100%",
      boxShadow: "none",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      backgroundColor: "#ffffff",
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: 600, color: "#1e293b" }}
      >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#64748b" }}>
        {description}
      </Typography>

      {/* Skills Gap Analysis */}
      <Typography
        variant="subtitle2"
        sx={{ mb: 3, color: "#1e293b", fontWeight: 600 }}
      >
        Skills Gap Analysis
      </Typography>
      {skills.map((skill, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "#1e293b", fontWeight: 500 }}
              >
                {skill.name}
              </Typography>
              {skill.yourLevel >= skill.requiredLevel ? (
                <CheckCircleIcon sx={{ color: "#10b981", fontSize: 16 }} />
              ) : (
                <ErrorIcon sx={{ color: "#ef4444", fontSize: 16 }} />
              )}
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Your Level: {skill.yourLevel}% / Required: {skill.requiredLevel}%
            </Typography>
          </Box>
          <Box sx={{ display: "flex", position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={skill.yourLevel}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#e2e8f0",
                flexGrow: 1,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  backgroundColor:
                    skill.yourLevel >= skill.requiredLevel
                      ? "#10b981"
                      : "#3b82f6",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: `${skill.requiredLevel}%`,
                height: "100%",
                width: 2,
                backgroundColor: "#ef4444",
              }}
            />
          </Box>
        </Box>
      ))}

      {/* Course Recommendations */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          <SchoolIcon fontSize="small" />
          Recommended Courses
        </Typography>
        {recommendations.map((course, index) => (
          <Box key={index} sx={{ mb: 3, "&:last-child": { mb: 0 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#1e293b", mb: 0.5 }}
                >
                  {course.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", display: "block", mb: 1 }}
                >
                  {course.platform} • {course.duration}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {course.skills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        fontSize: "0.75rem",
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 100,
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  "&:hover": {
                    borderColor: "#2563eb",
                    backgroundColor: "#f1f5f9",
                  },
                }}
              >
                Enroll
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

// Charts Section Component
const ChartsSection = ({ selectedTab, marketData, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (
    error &&
    (!marketData || Object.values(marketData).every((item) => !item))
  ) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        Error loading trend data. Please try again.
      </Alert>
    );
  }

  if (!marketData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No data available. Please refresh to try again.
        </Typography>
      </Box>
    );
  }

  if (selectedTab === "SALARY TRENDS") {
    return (
      <Box sx={{ height: 500, mb: 4 }}>
        {marketData.salaryTrends && marketData.salaryTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={marketData.salaryTrends}
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="salary"
                fill="#3b82f6"
                name="Average Salary ($)"
              />
              <Bar
                yAxisId="right"
                dataKey="growth"
                fill="#10b981"
                name="Growth (%)"
              />
              <Bar
                yAxisId="right"
                dataKey="openings"
                fill="#8b5cf6"
                name="Job Openings"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No salary trend data available
          </Typography>
        )}
      </Box>
    );
  }

  if (selectedTab === "INDUSTRY DISTRIBUTION") {
    const COLORS = [
      "#3b82f6",
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f97316",
      "#14b8a6",
    ];

    return (
      <Box sx={{ height: 500, mb: 4 }}>
        {marketData.industryDistribution &&
        marketData.industryDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketData.industryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={200}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, jobs }) =>
                  `${name} (${value}%) - ${jobs.toLocaleString()} jobs`
                }
              >
                {marketData.industryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [value + "%", name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No industry distribution data available
          </Typography>
        )}
      </Box>
    );
  }

  if (selectedTab === "SKILL DEMAND") {
    return (
      <Box sx={{ height: 500, mb: 4 }}>
        {marketData.skillDemand && marketData.skillDemand.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={marketData.skillDemand}
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="React" stroke="#3b82f6" />
              <Line type="monotone" dataKey="Node" stroke="#10b981" />
              <Line type="monotone" dataKey="Python" stroke="#8b5cf6" />
              <Line type="monotone" dataKey="AWS" stroke="#f59e0b" />
              <Line type="monotone" dataKey="DevOps" stroke="#ef4444" />
              <Line type="monotone" dataKey="AI" stroke="#6366f1" />
              <Line type="monotone" dataKey="Security" stroke="#ec4899" />
              <Line type="monotone" dataKey="UI" stroke="#14b8a6" />
              <Line type="monotone" dataKey="Mobile" stroke="#f97316" />
              <Line type="monotone" dataKey="Cloud" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No skill demand data available
          </Typography>
        )}
      </Box>
    );
  }

  if (selectedTab === "DOMAIN ANALYSIS") {
    return (
      <Grid container spacing={3}>
        {marketData.jobDetails && marketData.jobDetails.length > 0 ? (
          marketData.jobDetails.map((job, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "none",
                  borderRadius: "12px",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.role}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Required Skills:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {job.skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          size="small"
                          sx={{ backgroundColor: "#f1f5f9" }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Experience: {job.avgExperience}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remote Work: {job.remotePercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Top Locations: {job.topLocations.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No job details data available
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  }

  if (
    selectedTab === "TRENDING TECHNOLOGIES" &&
    (!marketData.trendingTech || marketData.trendingTech.length === 0)
  ) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        No trending technologies data available
      </Typography>
    );
  }

  return null;
};

// Skill gap data
const skillGapData = {
  categories: [
    {
      title: "Full Stack Development",
      description:
        "Compare your full stack development skills with market requirements",
      skills: [
        {
          name: "React",
          yourLevel: 65,
          requiredLevel: 92,
        },
        {
          name: "Node.js",
          yourLevel: 45,
          requiredLevel: 85,
        },
        {
          name: "SQL",
          yourLevel: 78,
          requiredLevel: 78,
        },
      ],
      recommendations: [
        {
          title: "Complete React Developer in 2024",
          platform: "Udemy",
          duration: "40 hours",
          skills: ["React", "Redux", "Hooks", "Context API"],
        },
        {
          title: "Node.js: The Complete Guide",
          platform: "Coursera",
          duration: "32 hours",
          skills: ["Node.js", "Express", "REST APIs"],
        },
      ],
    },
    {
      title: "Cloud Computing",
      description: "Essential cloud platform skills and certifications",
      skills: [
        {
          name: "AWS",
          yourLevel: 40,
          requiredLevel: 88,
        },
        {
          name: "Azure",
          yourLevel: 82,
          requiredLevel: 82,
        },
        {
          name: "Kubernetes",
          yourLevel: 35,
          requiredLevel: 70,
        },
      ],
      recommendations: [
        {
          title: "AWS Certified Solutions Architect",
          platform: "AWS Training",
          duration: "60 hours",
          skills: ["AWS", "Cloud Architecture", "Security"],
        },
        {
          title: "Kubernetes for Developers",
          platform: "Linux Foundation",
          duration: "25 hours",
          skills: ["Kubernetes", "Docker", "Container Orchestration"],
        },
      ],
    },
  ],
};

function TrendsWithGemini() {
  const [selectedTab, setSelectedTab] = useState("DOMAIN ANALYSIS");
  const [marketData, setMarketData] = useState({
    stats: null,
    salaryTrends: null,
    industryDistribution: null,
    skillDemand: null,
    trendingTech: null,
    jobDetails: null,
  });
  const [loading, setLoading] = useState({
    stats: false,
    salaryTrends: false,
    industryDistribution: false,
    skillDemand: false,
    trendingTech: false,
    jobDetails: false,
  });
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  const [dataSource, setDataSource] = useState("live");

  const fetchData = async () => {
    setError(null);
    setDataSource("live");
    const newLastUpdated = new Date().toLocaleString();
    setLastUpdated(newLastUpdated);

    // Helper to handle data fetching and setting
    const fetchAndSetData = async (dataType, fetchFunction) => {
      setLoading((prev) => ({ ...prev, [dataType]: true }));
      try {
        const data = await fetchFunction();
        setMarketData((prev) => ({ ...prev, [dataType]: data[dataType] }));
        return true;
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
        return false;
      } finally {
        setLoading((prev) => ({ ...prev, [dataType]: false }));
      }
    };

    try {
      // Fetch stats data
      await fetchAndSetData("stats", fetchMarketStats);

      // Fetch data for all tabs regardless of which is selected to ensure we have data
      await fetchAndSetData("jobDetails", fetchJobDetails);
      await fetchAndSetData("trendingTech", fetchTrendingTech);
      await fetchAndSetData("skillDemand", fetchSkillDemand);
      await fetchAndSetData("salaryTrends", fetchSalaryTrends);
      await fetchAndSetData("industryDistribution", fetchIndustryDistribution);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Some data may not be up to date. Showing most recent available data.",
      );
      setDataSource("fallback");
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get loading state for current tab
  const isCurrentTabLoading = () => {
    if (selectedTab === "DOMAIN ANALYSIS") return loading.jobDetails;
    if (selectedTab === "TRENDING TECHNOLOGIES") return loading.trendingTech;
    if (selectedTab === "SKILL DEMAND") return loading.skillDemand;
    if (selectedTab === "SALARY TRENDS") return loading.salaryTrends;
    if (selectedTab === "INDUSTRY DISTRIBUTION")
      return loading.industryDistribution;
    return false;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: "#1e293b" }}
        >
          Job Market Trends & Insights
        </Typography>
        <Box>
          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            size="small"
            onClick={fetchData}
            disabled={Object.values(loading).some(Boolean)}
          >
            Refresh Data
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              justifyContent: "flex-end",
            }}
          >
            {dataSource === "fallback" && (
              <Chip
                label="Using saved data"
                size="small"
                color="warning"
                sx={{ mr: 1, fontSize: "0.75rem" }}
              />
            )}
            <Typography variant="caption" display="block">
              Last updated: {lastUpdated}
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: "#475569" }}
      >
        Current Market Overview
      </Typography>
      {loading.stats ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {marketData.stats ? (
            marketData.stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  period={stat.period}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No market overview data available
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Tabs */}
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: "#475569" }}
      >
        Trend Analysis
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            },
          }}
        >
          <Tab value="DOMAIN ANALYSIS" label="Domain Analysis" />
          <Tab value="TRENDING TECHNOLOGIES" label="Trending Technologies" />
          <Tab value="SKILL DEMAND" label="Skill Demand" />
          <Tab value="SALARY TRENDS" label="Salary Trends" />
          <Tab value="INDUSTRY DISTRIBUTION" label="Industry Distribution" />
        </Tabs>
      </Box>

      {/* Charts Section */}
      <ChartsSection
        selectedTab={selectedTab}
        marketData={marketData}
        loading={isCurrentTabLoading()}
        error={error}
      />

      {/* Trending Technologies Section */}
      {selectedTab === "TRENDING TECHNOLOGIES" && (
        <Box sx={{ mb: 5 }}>
          {loading.trendingTech ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : marketData.trendingTech ? (
            <Grid container spacing={3}>
              {marketData.trendingTech.map((tech, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      border: "1px solid #e2e8f0",
                      boxShadow: "none",
                      borderRadius: "12px",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tech.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TrendingUpIcon sx={{ color: "#10b981" }} />
                        <Typography variant="body2" color="text.secondary">
                          {tech.growth}% YoY Growth
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No trending technologies data available
            </Typography>
          )}
        </Box>
      )}

      {/* Skill Gap Analysis Cards - Only show on Domain Analysis tab */}
      {selectedTab === "DOMAIN ANALYSIS" && (
        <>
          <Typography
            variant="h6"
            sx={{ mt: 5, mb: 2, fontWeight: 600, color: "#475569" }}
          >
            Your Skill Gap Analysis
          </Typography>
          <Grid container spacing={3}>
            {skillGapData.categories.slice(0, 2).map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <SkillGapCard
                  title={category.title}
                  description={category.description}
                  skills={category.skills}
                  recommendations={category.recommendations}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default TrendsWithGemini;
