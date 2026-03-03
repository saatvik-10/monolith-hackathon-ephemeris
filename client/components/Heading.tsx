import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function Heading({title}: {title: string}) {
  return (
    <SafeAreaView>
        <View>
            <Text className = "font-semibold text-solana-teal pl-4 text-3xl">{title}</Text>
        </View>
    </SafeAreaView>
  )
}
