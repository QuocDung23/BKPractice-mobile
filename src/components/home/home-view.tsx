import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import { MascotPlaceholder } from "@/components/ui";
import { useHomeData } from "@/hooks/auth/use-home-data";
import { useCourseData } from "@/hooks/courses";
import { Brands } from "@/lib/themes";

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
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-7"
      >
        <View className="bg-splash rounded-bl-[48px] rounded-br-[48px] px-5 pt-2 pb-6 overflow-hidden gap-[18px]">
          <View
            pointerEvents="none"
            className="absolute w-[150px] h-[150px] rounded-[75px] bg-homeHeaderAccent opacity-[0.75] right-[-40px] top-[-50px]"
          />
          <View className="flex-row items-center gap-[10px]">
            <View className="w-[42px] h-[42px] rounded-[21px] bg-homePink border-[1px] border-surface items-center justify-center">
              <Text className="text-avatarText font-brand-regular text-[15px]">
                {student.initials}
              </Text>
            </View>
            <View className="flex-1 gap-[2px]">
              <Text className="text-splashText font-brand-light text-[12px]">
                {today}
              </Text>
              <Text className="text-darkGreen font-brand-regular text-[17px] tracking-[-0.3px]">
                Good morning, {student.greetingName}!
              </Text>
            </View>
            <View
              accessibilityLabel={`${home.unreadNotifications} unread notification`}
              className="w-11 h-11 rounded-[22px] bg-surfaceTranslucent items-center justify-center"
            >
              <SymbolView
                name={{
                  ios: "bell",
                  android: "notifications",
                  web: "notifications",
                }}
                size={22}
                tintColor={Brands.colors.darkGreen}
              />
              {home.unreadNotifications > 0 && (
                <View className="absolute right-[9px] top-2 w-2 h-2 rounded-[4px] bg-error border-[1px] border-splash" />
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <MascotPlaceholder
              title="BYTEY"
              description="morning wave"
              width={78}
              height={88}
              compact
            />
            <View className="flex-1 gap-2">
              <View className="min-h-[60px] rounded-[18px] bg-surface flex-row items-center px-3 gap-[9px]">
                <SymbolView
                  name={{
                    ios: "flame",
                    android: "local_fire_department",
                    web: "local_fire_department",
                  }}
                  size={26}
                  tintColor={Brands.colors.homeOrange}
                />
                <View className="flex-1">
                  <Text className="text-text font-brand-regular text-[15px]">
                    {home.streakDays}-day streak
                  </Text>
                  <Text className="text-textSecondary font-brand-light text-[11px]">
                    Solve one problem to keep it alive
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-1">
                {WEEKDAYS.map((day, index) => (
                  <View
                    key={`${day}-${index}`}
                    className={`flex-1 h-[25px] min-w-0 items-center justify-center rounded-[13px] ${index === 4 ? "bg-primary" : home.completedWeekdays.includes(index) ? "bg-surface" : "bg-surfaceFaint"}`}
                  >
                    <Text
                      className={`font-brand-regular text-[10px] ${index === 4 ? "text-surface" : "text-primary"}`}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5 gap-[14px]">
          <View className="flex-row items-center justify-between mt-[2px]">
            <Text className="text-text font-brand-regular text-[17px] tracking-[-0.3px]">
              Your Course
            </Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.navigate("/courses")}
              hitSlop={10}
              className="min-h-11 justify-center"
            >
              <Text className="text-primary font-brand-medium text-[12px]">
                All courses
              </Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap justify-between gap-y-[14px]">
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

          <Text className="text-text font-brand-regular text-[17px] tracking-[-0.3px]">
            Continue Learning
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${course.title}`}
            onPress={() => router.push("/course-detail")}
            className="rounded-[22px] border-[1px] border-border bg-surface p-[17px] gap-[14px]"
          >
            <View className="flex-row items-start gap-3">
              <View className="w-12 h-12 rounded-[24px] bg-courseMint items-center justify-center">
                <SymbolView
                  name={{ ios: "curlybraces", android: "code", web: "code" }}
                  size={25}
                  tintColor={Brands.colors.primary}
                />
              </View>
              <View className="flex-1 gap-[2px]">
                <Text className="text-textSecondary font-brand-mono text-[11px]">
                  {course.code}
                </Text>
                <Text className="text-text font-brand-regular text-[16px] tracking-[-0.2px]">
                  {course.title}
                </Text>
                <Text className="text-textSecondary font-brand-light text-[12px]">
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
                tintColor={Brands.colors.textMuted}
              />
            </View>
            <View className="flex-row items-center gap-[10px]">
              <View className="flex-1 h-[7px] rounded-[4px] bg-progressTrack overflow-hidden">
                <View
                  className="h-[7px] rounded-[4px] bg-primary"
                  style={{
                    width: `${(course.currentLesson / course.totalLessons) * 100}%`,
                  }}
                />
              </View>
              <Text className="text-primary font-brand-monoMedium text-[11px]">
                {course.currentLesson}/{course.totalLessons}
              </Text>
            </View>
          </Pressable>

          <View className="rounded-[22px] bg-practice p-4 gap-[9px] overflow-hidden">
            <View className="flex-row items-center gap-[7px]">
              <SymbolView
                name={{ ios: "bolt", android: "bolt", web: "bolt" }}
                size={20}
                tintColor={Brands.colors.homeBlueText}
              />
              <Text className="text-homeBlueText font-brand-regular text-[12px] tracking-[0.4px]">
                RECOMMENDED QUIZ
              </Text>
            </View>
            <Text className="text-text font-brand-regular text-[17px] tracking-[-0.3px]">
              {quiz.title}
            </Text>
            <Text className="text-homeBlueText font-brand-light text-[12px]">
              {quiz.questions} questions · {quiz.minutes} min · builds on Lesson{" "}
              {quiz.basedOnLesson}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start quiz"
              onPress={() => router.push("/quiz-question")}
              className="self-start mt-[6px] h-[38px] rounded-[20px] bg-surface px-[15px] flex-row items-center gap-[6px]"
            >
              <Text className="text-primary font-brand-medium text-[13px]">
                Start quiz
              </Text>
              <SymbolView
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                size={18}
                tintColor={Brands.colors.primary}
              />
            </Pressable>
          </View>

          <View className="min-h-[120px] rounded-[30px] border-[1px] border-border bg-surface p-4 flex-row items-center gap-[14px]">
            <View
              accessibilityLabel={`${weeklyProgress.percent}% weekly progress`}
              className="w-[84px] h-[84px] rounded-[42px] border-[8px] border-border items-center justify-center"
            >
              <View className="absolute top-[-8px] left-[-8px] w-[84px] h-[84px] rounded-[42px] border-[8px] border-primary border-l-transparent rotate-[-25deg]" />
              <View className="items-center">
                <Text className="text-text font-brand-medium text-[19px]">
                  {weeklyProgress.percent}%
                </Text>
                <Text className="text-textSecondary font-brand-light text-[10px]">
                  weekly
                </Text>
              </View>
            </View>
            <View className="flex-1 gap-[11px]">
              <Text className="text-text font-brand-regular text-[15px]">
                This week&apos;s progress
              </Text>
              <View className="flex-row gap-[6px]">
                <View className="flex-1 min-w-0 bg-background rounded-[16px] px-[7px] py-[6px]">
                  <Text className="text-primary font-brand-mono text-[16px]">
                    {weeklyProgress.problems}
                  </Text>
                  <Text className="text-textSecondary font-brand-light text-[10px]">
                    problems
                  </Text>
                </View>
                <View className="flex-1 min-w-0 bg-background rounded-[16px] px-[7px] py-[6px]">
                  <Text className="text-primary font-brand-mono text-[16px]">
                    {weeklyProgress.quizzes}
                  </Text>
                  <Text className="text-textSecondary font-brand-light text-[10px]">
                    quizzes
                  </Text>
                </View>
                <View className="flex-1 min-w-0 bg-background rounded-[16px] px-[7px] py-[6px]">
                  <Text className="text-primary font-brand-mono text-[16px]">
                    {weeklyProgress.focusHours}h
                  </Text>
                  <Text className="text-textSecondary font-brand-light text-[10px]">
                    focus
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${assignment.title}`}
            onPress={() => router.push("/assignment-detail")}
            className="rounded-[22px] border-[1px] border-border bg-surface p-[17px] gap-[13px] active:opacity-[0.84]"
          >
            <View className="flex-row items-center justify-between gap-[6px]">
              <Text className="text-text font-brand-regular text-[15px]">
                Upcoming assignment
              </Text>
              <View className="bg-warningBackground rounded-[12px] px-2 py-[5px]">
                <Text className="text-warningText font-brand-medium text-[10px]">
                  Due in {assignment.dueInDays} days
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-[15px] bg-grow items-center justify-center">
                <SymbolView
                  name={{
                    ios: "doc.text",
                    android: "assignment",
                    web: "assignment",
                  }}
                  size={23}
                  tintColor={Brands.colors.growText}
                />
              </View>
              <View className="flex-1 gap-[3px]">
                <Text className="text-text font-brand-regular text-[14px]">
                  {assignment.title}
                </Text>
                <Text className="text-textSecondary font-brand-light text-[12px]">
                  {assignment.acceptedProblems} of {assignment.totalProblems}{" "}
                  problems accepted
                </Text>
              </View>
            </View>
          </Pressable>

          <View className="rounded-[22px] border-[1px] border-border bg-surface p-4 flex-row items-center gap-3">
            <View className="w-[45px] h-[45px] rounded-[16px] bg-homePink items-center justify-center">
              <SymbolView
                name={{
                  ios: "trophy",
                  android: "emoji_events",
                  web: "emoji_events",
                }}
                size={25}
                tintColor={Brands.colors.homePinkText}
              />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-textSecondary font-brand-light text-[11px]">
                New achievement
              </Text>
              <Text className="text-text font-brand-regular text-[14px]">
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
              tintColor={Brands.colors.textMuted}
            />
          </View>
        </View>
      </ScrollView>

      <BottomNavigation active="Home" />
    </SafeAreaView>
  );
}
