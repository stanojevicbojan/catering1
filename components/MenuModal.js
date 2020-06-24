import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons'
import colors from '../Colors'
import NumericInput from 'react-native-numeric-input'
import { SwipeListView } from 'react-native-swipe-list-view';

export default class MenuModal extends React.Component {
    state = {
        newTodo: "",
        value: 0,
    }

    toggleTodoCompleted = index => {
        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed
        this.props.updateList(list)
    }

    addTodo = () => {
        let list = this.props.list
        list.todos.push({title: this.state.newTodo, completed: false})

        this.props.updateList(list)
        this.setState({newTodo: "" })

        //if dismissing keyboard is needed
        //Keyboard.dismiss()
    }

    deleteTodo = index => {
        let list = this.props.list

        list.todos.splice(index, 1)

        this.props.updateList(list)
    }

    renderTodo = (todo, index) => {
        return (
                <View style={styles.todoContainer}>

                   {/* <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                            <Ionicons name={todo.completed? 'ios-square' : 'ios-square-outline'} size={24} color={colors.gray} />
        </TouchableOpacity>*/}
                    <Text style={[styles.todo, {
                            textDecorationLine: todo.completed ? 'line-through' : "none", 
                            color: todo.completed ? colors.gray : colors.black}]}>{todo.title
                            }
                    </Text>
                    

                    <TouchableOpacity style={styles.deleteContainer} onPress={() => this.deleteTodo(index)}>
                            <Ionicons style={styles.deleteButton} name={'md-trash'} size={38} color={colors.gray} />
                    </TouchableOpacity>
                </View>
        )
    }


  render() {
      const list = this.props.list
      
      const taskCount = list.todos.length
      const completedCount = list.todos.filter(todo => todo.completed).length

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={60} style={{flex: 1}} behavior="height">
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={{position: "absolute", top: 38, right: 32, zIndex: 10}}
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                    <View>
                        <Text style={styles.title}>{list.name}</Text>

                    </View>
                </View>
                
                <View style={[styles.section, {flex: 10}]}>
                    <SwipeListView
                        data={list.todos}
                        renderItem={({ item, index }) => 
                        <View style={styles.rowFront}>
                            <NumericInput 
                                value={this.state.value} 
                                onChange={value => this.setState({value})} 
                                onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                                totalWidth={90} 
                                totalHeight={50} 
                                iconSize={25}
                                step={1}
                                valueType='real'
                                rounded 
                                textColor='#B0228C' 
                                iconStyle={{ color: 'white' }} 
                                rightButtonBackgroundColor='#EA3788' 
                                leftButtonBackgroundColor='#E56B70'
                            />
                            <Text style={[styles.todo]}>{item.title
                                }
                            </Text>
                        </View>
                        }
                        //this.renderTodo(item, index)}
                        renderHiddenItem={({ item, index }) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity
                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                onPress={() => this.deleteTodo(item)}
                                >
                                <Text style={styles.backTextWhite}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        
                        rightOpenValue={-75}
                        contentContainerStyle={{paddingHorizontal: 32, paddingVertical: 64}}
                        showsVerticalScrollIndicator={false}
                    />

                </View>
                
                <View style={[styles.section, styles.footer]}>
                    <TextInput 
                        style={[styles.input, {borderColor: list.color}]}
                        onChangeText={text => this.setState({newTodo: text})}
                        value={this.state.newTodo}
                    />
                    <TouchableOpacity
                        style={[styles.addTodo, {backgroundColor: list.color}]}
                        onPress={() => this.addTodo()}
                    >
                        <AntDesign name="plus" size={16} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    section: {
        flex: 1,
        alignSelf: 'stretch',
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 44,
        marginRight: 150,
        
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: "700"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    todo: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 22,
        marginLeft: 8
    },
    deleteContainer: {
        flex: 1,
    },
    deleteButton: {
        alignSelf: 'flex-end'
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffffe',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        borderTopColor: 'black',
        borderTopWidth: 1,
        //justifyContent: 'center',
        height: 70,
        marginBottom: 5,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginBottom: 5,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
})