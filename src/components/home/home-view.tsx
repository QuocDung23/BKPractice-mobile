import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import { MascotPlaceholder } from "@/components/ui";
import { useHomeData } from "@/hooks/auth/use-home-data";
import { useCourseData } from "@/hooks/courses";
import { BrandColors, BrandFonts } from "@/lib/themes/theme";

import { HomeCourseCard } from "./home-course-card";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const HOME_COURSES = [
  {
    code: "CO2005",
    illustration: require("../../../assets/images/home/oop.png"),
  },
  {
    code: "CO1003",
    illustration: require("../../../assets/images/home/programming.png"),
  },
  {
    code: "CO2003",
    illustration: require("../../../assets/images/home/data-structures.png"),
  },
  {
    code: "CO1007",
    illustration: require("../../../assets/images/home/discrete-structures.png"),
  },
] as const;

export function HomeView(): ReactElement {
  const session = useHomeData();
  const courseData = useCourseData();
  if (!session || !courseData) return <Redirect href="/sign-in" />;

  const { student, home } = session;
  const { weeklyProgress, course, assignment, quiz, achievement } = home;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View pointerEvents="none" style={styles.headerCircle} />
          <View style={styles.headerTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{student.initials}</Text>
            </View>
            <View style={styles.greeting}>
              <Text style={styles.date}>{today}</Text>
              <Text style={styles.greetingText}>
                Good morning, {student.greetingName}!
              </Text>
            </View>
            <View
              accessibilityLabel={`${home.unreadNotifications} unread notification`}
              style={styles.notification}
            >
              <SymbolView
                name={{
                  ios: "bell",
                  android: "notifications",
                  web: "notifications",
                }}
                size={22}
                tintColor={BrandColors.darkGreen}
              />
              {home.unreadNotifications > 0 && (
                <View style={styles.notificationDot} />
              )}
            </View>
          </View>

          <View style={styles.streakRow}>
            <MascotPlaceholder
              title="BYTEY"
              description="morning wave"
              width={78}
              height={88}
              compact
            />
            <View style={styles.streakDetails}>
              <View style={styles.streakCard}>
                <SymbolView
                  name={{
                    ios: "flame",
                    android: "local_fire_department",
                    web: "local_fire_department",
                  }}
                  size={26}
                  tintColor={BrandColors.homeOrange}
                />
                <View style={styles.streakCopy}>
                  <Text style={styles.streakTitle}>
                    {home.streakDays}-day streak
                  </Text>
                  <Text style={styles.streakCaption}>
                    Solve one problem to keep it alive
                  </Text>
                </View>
              </View>
              <View style={styles.weekRow}>
                {WEEKDAYS.map((day, index) => (
                  <View
                    key={`${day}-${index}`}
                    style={[
                      styles.weekDay,
                      home.completedWeekdays.includes(index) &&
                        styles.weekDayCompleted,
                      index === 4 && styles.weekDayCurrent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.weekDayText,
                        index === 4 && styles.weekDayTextCurrent,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Your Course</Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.navigate("/courses")}
              hitSlop={10}
              style={styles.sectionLinkButton}
            >
              <Text style={styles.sectionLink}>All courses</Text>
            </Pressable>
          </View>
          <View style={styles.courseGrid}>
            {HOME_COURSES.map(({ code, illustration }) => {
              const featuredCourse = courseData.courses.find(
                (item) => item.code === code,
              );
              return featuredCourse ? (
                <HomeCourseCard
                  key={code}
                  course={featuredCourse}
                  illustration={illustration}
                />
              ) : null;
            })}
          </View>

          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${course.title}`}
            onPress={() => router.push("/course-detail")}
            style={styles.courseCard}
          >
            <View style={styles.courseRow}>
              <View style={styles.courseIcon}>
                <SymbolView
                  name={{ ios: "curlybraces", android: "code", web: "code" }}
                  size={25}
                  tintColor={BrandColors.primary}
                />
              </View>
              <View style={styles.courseCopy}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseNext}>
                  Next: Lesson {course.currentLesson} · {course.nextLesson}
                </Text>
              </View>
              <SymbolView
                name={{
                  ios: "chevron.right",
                  android: "chevron_right",
                  web: "chevron_right",
                }}
                size={22}
                tintColor={BrandColors.textMuted}
              />
            </View>
            <View style={styles.courseProgressRow}>
              <View style={styles.courseProgressTrack}>
                <View
                  style={[
                    styles.courseProgressFill,
                    {
                      width: `${(course.currentLesson / course.totalLessons) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.courseProgressLabel}>
                {course.currentLesson}/{course.totalLessons}
              </Text>
            </View>
          </Pressable>

          <View style={styles.quizCard}>
            <View style={styles.quizEyebrow}>
              <SymbolView
                name={{ ios: "bolt", android: "bolt", web: "bolt" }}
                size={20}
                tintColor={BrandColors.homeBlueText}
              />
              <Text style={styles.quizEyebrowText}>RECOMMENDED QUIZ</Text>
            </View>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizCaption}>
              {quiz.questions} questions · {quiz.minutes} min · builds on Lesson{" "}
              {quiz.basedOnLesson}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start quiz"
              onPress={() => router.push("/quiz-question")}
              style={styles.quizButton}
            >
              <Text style={styles.quizButtonText}>Start quiz</Text>
              <SymbolView
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                size={18}
                tintColor={BrandColors.primary}
              />
            </Pressable>
          </View>

          <View style={styles.progressCard}>
            <View
              accessibilityLabel={`${weeklyProgress.percent}% weekly progress`}
              style={styles.progressRing}
            >
              <View style={styles.progressRingFill} />
              <View style={styles.progressRingCenter}>
                <Text style={styles.progressPercent}>
                  {weeklyProgress.percent}%
                </Text>
                <Text style={styles.progressWeekly}>weekly</Text>
              </View>
            </View>
            <View style={styles.progressDetails}>
              <Text style={styles.cardTitle}>This week&apos;s progress</Text>
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {weeklyProgress.problems}
                  </Text>
                  <Text style={styles.metricLabel}>problems</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {weeklyProgress.quizzes}
                  </Text>
                  <Text style={styles.metricLabel}>quizzes</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {weeklyProgress.focusHours}h
                  </Text>
                  <Text style={styles.metricLabel}>focus</Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${assignment.title}`}
            onPress={() => router.push("/assignment-detail")}
            style={({ pressed }) => [
              styles.assignmentCard,
              pressed && styles.assignmentCardPressed,
            ]}
          >
            <View style={styles.assignmentTop}>
              <Text style={styles.cardTitle}>Upcoming assignment</Text>
              <View style={styles.duePill}>
                <Text style={styles.dueText}>
                  Due in {assignment.dueInDays} days
                </Text>
              </View>
            </View>
            <View style={styles.assignmentRow}>
              <View style={styles.assignmentIcon}>
                <SymbolView
                  name={{
                    ios: "doc.text",
                    android: "assignment",
                    web: "assignment",
                  }}
                  size={23}
                  tintColor="#8A8F4E"
                />
              </View>
              <View style={styles.assignmentCopy}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentCaption}>
                  {assignment.acceptedProblems} of {assignment.totalProblems}{" "}
                  problems accepted
                </Text>
              </View>
            </View>
          </Pressable>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <SymbolView
                name={{
                  ios: "trophy",
                  android: "emoji_events",
                  web: "emoji_events",
                }}
                size={25}
                tintColor={BrandColors.homePinkText}
              />
            </View>
            <View style={styles.achievementCopy}>
              <Text style={styles.achievementLabel}>New achievement</Text>
              <Text style={styles.achievementTitle}>
                {achievement.title} · {achievement.problemsSolved} problems
                solved
              </Text>
            </View>
            <SymbolView
              name={{
                ios: "chevron.right",
                android: "chevron_right",
                web: "chevron_right",
              }}
              size={22}
              tintColor={BrandColors.textMuted}
            />
          </View>
        </View>
      </ScrollView>

      <BottomNavigation active="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BrandColors.surface },
  scrollView: { flex: 1, backgroundColor: BrandColors.background },
  scrollContent: { paddingBottom: 28 },
  header: {
    backgroundColor: BrandColors.splash,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    overflow: "hidden",
    gap: 18,
  },
  headerCircle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: BrandColors.homeHeaderAccent,
    opacity: 0.75,
    right: -40,
    top: -50,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BrandColors.homePink,
    borderWidth: 1,
    borderColor: BrandColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#B4576D",
    fontFamily: BrandFonts.regular,
    fontSize: 15,
  },
  greeting: { flex: 1, gap: 2 },
  date: { color: "#2F6459", fontFamily: BrandFonts.light, fontSize: 12 },
  greetingText: {
    color: BrandColors.darkGreen,
    fontFamily: BrandFonts.regular,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  notification: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF99",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    right: 9,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F26B6B",
    borderWidth: 1,
    borderColor: BrandColors.splash,
  },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  streakDetails: { flex: 1, gap: 8 },
  streakCard: {
    minHeight: 60,
    borderRadius: 18,
    backgroundColor: BrandColors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 9,
  },
  streakCopy: { flex: 1 },
  streakTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 15,
  },
  streakCaption: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 11,
  },
  weekRow: { flexDirection: "row", gap: 4 },
  weekDay: {
    flex: 1,
    height: 25,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#FFFFFF73",
  },
  weekDayCompleted: { backgroundColor: BrandColors.surface },
  weekDayCurrent: { backgroundColor: BrandColors.primary },
  weekDayText: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.regular,
    fontSize: 10,
  },
  weekDayTextCurrent: { color: BrandColors.surface },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  courseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  progressCard: {
    minHeight: 120,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.surface,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  progressRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 8,
    borderColor: BrandColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRingFill: {
    position: "absolute",
    top: -8,
    left: -8,
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 8,
    borderColor: BrandColors.primary,
    borderLeftColor: "transparent",
    transform: [{ rotate: "-25deg" }],
  },
  progressRingCenter: { alignItems: "center" },
  progressPercent: {
    color: BrandColors.text,
    fontFamily: BrandFonts.medium,
    fontSize: 19,
  },
  progressWeekly: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 10,
  },
  progressDetails: { flex: 1, gap: 11 },
  cardTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 15,
  },
  metricsRow: { flexDirection: "row", gap: 6 },
  metric: {
    flex: 1,
    minWidth: 0,
    backgroundColor: BrandColors.background,
    borderRadius: 16,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  metricValue: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.mono,
    fontSize: 16,
  },
  metricLabel: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 10,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  sectionTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  sectionLink: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.medium,
    fontSize: 12,
  },
  sectionLinkButton: { minHeight: 44, justifyContent: "center" },
  courseCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.surface,
    padding: 17,
    gap: 14,
  },
  courseRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DCEFE9",
    alignItems: "center",
    justifyContent: "center",
  },
  courseCopy: { flex: 1, gap: 2 },
  courseCode: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.mono,
    fontSize: 11,
  },
  courseTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  courseNext: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 12,
  },
  courseProgressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  courseProgressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EDF4F1",
    overflow: "hidden",
  },
  courseProgressFill: {
    height: 7,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
  },
  courseProgressLabel: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.monoMedium,
    fontSize: 11,
  },
  assignmentCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.surface,
    padding: 17,
    gap: 13,
  },
  assignmentCardPressed: { opacity: 0.84 },
  assignmentTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  duePill: {
    backgroundColor: BrandColors.warningBackground,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  dueText: {
    color: BrandColors.warningText,
    fontFamily: BrandFonts.medium,
    fontSize: 10,
  },
  assignmentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  assignmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: BrandColors.grow,
    alignItems: "center",
    justifyContent: "center",
  },
  assignmentCopy: { flex: 1, gap: 3 },
  assignmentTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 14,
  },
  assignmentCaption: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 12,
  },
  quizCard: {
    borderRadius: 22,
    backgroundColor: BrandColors.practice,
    padding: 16,
    gap: 9,
    overflow: "hidden",
  },
  quizEyebrow: { flexDirection: "row", alignItems: "center", gap: 7 },
  quizEyebrowText: {
    color: BrandColors.homeBlueText,
    fontFamily: BrandFonts.regular,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  quizTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  quizCaption: {
    color: BrandColors.homeBlueText,
    fontFamily: BrandFonts.light,
    fontSize: 12,
  },
  quizButton: {
    alignSelf: "flex-start",
    marginTop: 6,
    height: 38,
    borderRadius: 20,
    backgroundColor: BrandColors.surface,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quizButtonText: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.medium,
    fontSize: 13,
  },
  achievementCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.surface,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  achievementIcon: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: BrandColors.homePink,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementCopy: { flex: 1, gap: 4 },
  achievementLabel: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 11,
  },
  achievementTitle: {
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 14,
  },
});
