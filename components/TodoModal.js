import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons'
import colors from '../Colors'
import firebase from '../database/firebaseDb';


export default class TodoModal extends React.Component {
    state = {
        newTodo: ""
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

    //resets current items in the Shopping list
    resetShoppingList() {
        //get all available tokens
        const docRef = firebase.firestore().collection('users').doc('1mXHCyEEYnhyIqiqyeqi').collection('lists').doc('PHctNyYf5MHyofyNkW2j')

        // Reset todos in the Shopping list
        docRef.update({todos: firebase.firestore.FieldValue.delete()
        });
        docRef.update({todos: []
        });
        
    }

    renderTodo = (todo, index) => {
        return (
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                            <Ionicons name={todo.completed? 'ios-square' : 'ios-square-outline'} size={24} color={colors.gray} />
                    </TouchableOpacity>
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
      
      const taskCount = list.todos == undefined ? 0 : list.todos.length
      const completedCount = list.todos == undefined ? 0 : list.todos.filter(todo => todo.completed).length

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={{position: "absolute", top: 64, right: 32, zIndex: 10}}
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                    <View>
                        <TouchableOpacity onPress={() => this.resetShoppingList()}><Text>Reset list</Text></TouchableOpacity>
                        <Text style={styles.title}>{list.name}</Text>
                        <Text style={styles.taskCount}>
                            {completedCount} of {taskCount} tasks
                        </Text>
                    </View>
                </View>
                
                <View style={[styles.section, {flex: 3}]}>
                    <FlatList
                        data={list.todos}
                        renderItem={({ item, index }) => this.renderTodo(item, index)}
                        keyExtractor={(_, index) => index.toString()}
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
        borderWidth: 1,
        borderColor: 'black',
    },
    section: {
        flex: 1,
        alignSelf: 'stretch'
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 64,
        borderBottomWidth: 3
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
        alignItems: "center"
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    todo: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8
    },
    deleteContainer: {
        flex: 1,
    },
    deleteButton: {
        alignSelf: 'flex-end'
    }
})