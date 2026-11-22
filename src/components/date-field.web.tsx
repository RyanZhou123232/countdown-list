import { TextInput, StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';

export default function DateField({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  return (
    <TextInput
      accessibilityLabel="Event date"
      placeholder="YYYY-MM-DD"
      placeholderTextColor={colors.muted}
      value={value}
      onChangeText={onChange}
      maxLength={10}
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.field}
    />
  );
}

const styles = StyleSheet.create({
  field: { minHeight: 52, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.surface, color: colors.ink, fontSize: 16 },
});
