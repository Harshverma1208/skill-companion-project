import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const SkillProgressChart = () => {
  const theme = useTheme();

  // Sample data - replace with real data in production
  const data = [
    {
      name: "React",
      current: 85,
      target: 95,
      category: "Frontend",
    },
    {
      name: "Node.js",
      current: 75,
      target: 90,
      category: "Backend",
    },
    {
      name: "MongoDB",
      current: 70,
      target: 85,
      category: "Database",
    },
    {
      name: "TypeScript",
      current: 65,
      target: 80,
      category: "Language",
    },
    {
      name: "AWS",
      current: 60,
      target: 85,
      category: "Cloud",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const skill = data.find((item) => item.name === label);
      return (
        <Paper
          elevation={3}
          sx={{
            background: alpha(theme.palette.background.paper, 0.95),
            p: 2,
            borderRadius: 2,
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            minWidth: 200,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              {label}
            </Typography>
            <Chip
              label={skill.category}
              size="small"
              sx={{
                background: `${theme.palette.background.gradient}`,
                color: "white",
                width: "fit-content",
              }}
            />
            <Box sx={{ color: theme.palette.text.secondary }}>
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <span>Current Level:</span>
                <span
                  style={{ color: theme.palette.primary.main, fontWeight: 600 }}
                >
                  {payload[0].value}%
                </span>
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Target Level:</span>
                <span
                  style={{
                    color: theme.palette.secondary.main,
                    fontWeight: 600,
                  }}
                >
                  {payload[1].value}%
                </span>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        height: 500,
        p: 4,
        borderRadius: 3,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha("#fff", 0.8),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: theme.palette.background.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "0.5px",
          }}
        >
          Skill Progress Overview
        </Typography>
      </Stack>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={alpha(theme.palette.divider, 0.1)}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: theme.palette.text.secondary }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.2) }}
          />
          <YAxis
            tick={{ fill: theme.palette.text.secondary }}
            axisLine={{ stroke: alpha(theme.palette.divider, 0.2) }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="current" name="Current Level" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
            ))}
          </Bar>
          <Bar
            dataKey="target"
            name="Target Level"
            radius={[6, 6, 0, 0]}
            fill={alpha(theme.palette.secondary.main, 0.4)}
          />
          <defs>
            {data.map((_, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={theme.palette.primary.light}
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.9}
                />
              </linearGradient>
            ))}
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SkillProgressChart;
