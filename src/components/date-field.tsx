import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { formatDate, localDateKey } from '@/lib/countdowns';

export default function DateField({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const [draft, setDraft] = useState<Date | null>(null);
  const isIOS = Platform.OS === 'ios';

  function confirm(date: Date) {
    onChange(localDateKey(date));
    setDraft(null);
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? `Event date, ${formatDate(value)}` : 'Choose event date'}
        style={styles.field}
        onPress={() => setDraft(value ? new Date(`${value}T12:00:00`) : new Date())}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>{value ? formatDate(value) : 'Choose a date'}</Text>
      </Pressable>
      {draft && (
        <View>
          <DateTimePicker
            value={draft}
            mode="date"
            display={isIOS ? 'spinner' : 'default'}
            themeVariant="light"
            onDismiss={() => setDraft(null)}
            onValueChange={(_, date) => {
              if (isIOS) setDraft(date);
              else confirm(date);
            }}
          />
          {isIOS && (
            <Pressable accessibilityRole="button" style={styles.done} onPress={() => confirm(draft)}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { minHeight: 52, justifyContent: 'center', borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.surface },
  value: { fontSize: 16, color: colors.ink },
  placeholder: { color: colors.muted },
  done: { alignSelf: 'flex-end', padding: 12 },
  doneText: { fontSize: 16, color: colors.accent, fontWeight: '700' },
});
