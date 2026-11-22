import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DateField from '@/components/date-field';
import { colors } from '@/constants/colors';
import { isDateKey, saveCountdown } from '@/lib/countdowns';

export default function AddScreen() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  async function save() {
    if (savingRef.current) return;

    const title = name.trim();
    if (!title) {
      setError('Enter a name for your event.');
      return;
    }
    if (!isDateKey(date)) {
      setError(Platform.OS === 'web' ? 'Enter a valid date in YYYY-MM-DD format.' : 'Choose a date for your event.');
      return;
    }

    setError('');
    savingRef.current = true;
    setSaving(true);
    try {
      await saveCountdown(title, date);
      router.dismissTo('/');
    } catch {
      setError('Your countdown couldn’t be saved. Please try again.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Event name</Text>
            <TextInput
              accessibilityLabel="Event name"
              placeholder="e.g., Road trip"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              maxLength={80}
              autoCapitalize="sentences"
              returnKeyType="done"
              editable={!saving}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Event date</Text>
            <DateField value={date} onChange={(value) => {
              setDate(value);
              setError('');
            }} />
          </View>
          {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: saving, busy: saving }}
            disabled={saving}
            onPress={() => void save()}
            style={({ pressed }) => [styles.button, (pressed || saving) && styles.pressed]}
          >
            <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save countdown'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 24, gap: 20 },
  field: { gap: 8 },
  label: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  input: { minHeight: 52, color: colors.ink, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 14, fontSize: 16 },
  error: { color: colors.error, fontSize: 15, lineHeight: 21 },
  button: { minHeight: 54, justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: colors.accent, marginTop: 4 },
  buttonText: { color: colors.surface, fontSize: 17, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
