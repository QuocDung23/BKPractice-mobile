import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark, MascotPlaceholder } from '@/components/ui';
import { BrandColors, BrandFonts } from '@/lib/theme';

export function SignInView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [feedback, setFeedback] = useState('');

  function submitSignIn(): void {
    setFeedback(
      email.trim() && password
        ? 'Sign in is not connected yet.'
        : 'Enter your student email and password.',
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.headerCircle} />
            <View style={styles.headerCopy}>
              <View style={styles.brandRow}>
                <BrandMark size={30} />
                <Text style={styles.brandName}>BKPractice</Text>
              </View>
              <Text style={styles.welcome}>Welcome back</Text>
              <Text style={styles.welcomeCaption}>Bytey missed you.</Text>
            </View>
            <MascotPlaceholder title="BYTEY" description="peeking" width={74} height={90} compact />
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Student email</Text>
              <View style={styles.inputShell}>
                <SymbolView name={{ ios: 'envelope', android: 'mail', web: 'mail' }} size={19} tintColor={BrandColors.textMuted} />
                <TextInput
                  accessibilityLabel="Student email"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={(value) => { setEmail(value); setFeedback(''); }}
                  placeholder="A.nguyen@student.bkp.edu"
                  placeholderTextColor={BrandColors.text}
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputShell, styles.passwordShell]}>
                <SymbolView name={{ ios: 'lock', android: 'lock', web: 'lock' }} size={19} tintColor={BrandColors.primary} />
                <TextInput
                  accessibilityLabel="Password"
                  autoComplete="password"
                  onChangeText={(value) => { setPassword(value); setFeedback(''); }}
                  placeholder="••••••••••"
                  placeholderTextColor={BrandColors.text}
                  secureTextEntry={!passwordVisible}
                  style={styles.input}
                  value={password}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.visibilityButton}>
                  <SymbolView
                    name={{
                      ios: passwordVisible ? 'eye' : 'eye.slash',
                      android: passwordVisible ? 'visibility' : 'visibility_off',
                      web: passwordVisible ? 'visibility' : 'visibility_off',
                    }}
                    size={21}
                    tintColor={BrandColors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.optionsRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberButton}>
                <View style={[styles.checkbox, !rememberMe && styles.checkboxUnchecked]}>
                  {rememberMe && <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={13} tintColor={BrandColors.surface} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setFeedback('Password recovery is not connected yet.')}
                style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={submitSignIn}
              style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}>
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
            {feedback ? <Text accessibilityRole="alert" style={styles.feedback}>{feedback}</Text> : null}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => setFeedback('University SSO is not connected yet.')}
              style={({ pressed }) => [styles.ssoButton, pressed && styles.pressed]}>
              <SymbolView name={{ ios: 'graduationcap', android: 'school', web: 'school' }} size={18} tintColor={BrandColors.primary} />
              <Text style={styles.ssoText}>Continue with university SSO</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BrandColors.surface },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  header: {
    height: 151,
    backgroundColor: BrandColors.learn,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerCircle: {
    position: 'absolute',
    top: -41,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DCEFE9',
  },
  headerCopy: { flex: 1, gap: 4 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 4 },
  brandName: { color: BrandColors.darkGreen, fontFamily: BrandFonts.regular, fontSize: 19, letterSpacing: -0.7 },
  welcome: { color: BrandColors.text, fontFamily: BrandFonts.regular, fontSize: 24, letterSpacing: -0.9 },
  welcomeCaption: { color: '#5C7A70', fontFamily: BrandFonts.light, fontSize: 14 },
  form: { paddingHorizontal: 20, paddingTop: 28, gap: 16 },
  fieldGroup: { gap: 8 },
  label: { color: BrandColors.text, fontFamily: BrandFonts.medium, fontSize: 13 },
  inputShell: {
    height: 52,
    borderColor: BrandColors.fieldBorder,
    borderWidth: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingLeft: 17,
    paddingRight: 10,
    backgroundColor: BrandColors.surface,
  },
  passwordShell: {
    borderColor: BrandColors.primary,
    shadowColor: BrandColors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 15,
    paddingVertical: 0,
  },
  visibilityButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rememberButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9 },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: BrandColors.primary,
    borderWidth: 1,
  },
  checkboxUnchecked: { backgroundColor: BrandColors.surface },
  rememberText: { color: BrandColors.text, fontFamily: BrandFonts.light, fontSize: 14 },
  forgotButton: { minHeight: 44, justifyContent: 'center' },
  forgotText: { color: BrandColors.primary, fontFamily: BrandFonts.medium, fontSize: 14 },
  signInButton: {
    height: 52,
    borderRadius: 28,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.primary,
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 4,
  },
  signInText: { color: BrandColors.surface, fontFamily: BrandFonts.regular, fontSize: 16 },
  feedback: { color: '#D14E4E', fontFamily: BrandFonts.regular, fontSize: 13, lineHeight: 18 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 1 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BrandColors.border },
  dividerText: { color: BrandColors.textMuted, fontFamily: BrandFonts.light, fontSize: 12 },
  ssoButton: {
    height: 52,
    borderRadius: 28,
    borderColor: BrandColors.fieldBorder,
    borderWidth: 1,
    backgroundColor: BrandColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ssoText: { color: BrandColors.text, fontFamily: BrandFonts.medium, fontSize: 15 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.98 }] },
});
